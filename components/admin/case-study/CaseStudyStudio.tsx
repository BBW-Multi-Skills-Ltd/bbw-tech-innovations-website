'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { PhoneFrame } from '@/components/PhoneFrame'
import { CaseStudyBlock, Cover } from '@/components/case-study/Blocks'
import { sectionClass, toSections } from '@/components/case-study/CaseStudyArticle'
import { DrawnScreen } from '@/components/projects/DrawnScreen'
import { bundledBlocks } from '@/lib/case-studies/bundled'
import { blocksFromProject, liveSiteUrl } from '@/lib/case-studies/from-project'
import { hasCaseStudy } from '@/lib/case-studies/data-rules'
import { blockFields, blockLabel, cleanData, COVER_PRESET, isEditable, PRESETS, SECTION_FIELD, withDefaults, type EditableType, type Preset } from '@/lib/case-studies/editor-fields'
import type { Block } from '@/lib/case-studies/types'
import {
  deleteCaseStudyBlock, fetchCaseStudyBlocks, insertCaseStudyBlock, reorderCaseStudyBlocks, setCaseStudyBlockPublished, startCaseStudyFrom, updateCaseStudyBlock, type BlockRow,
} from '@/lib/cms/caseStudyRepository'
import type { Project } from '@/lib/data/projects'
import { projectDevices, projectTypeOf, typeLabel } from '@/lib/project-types'
import { AgentPrompts } from './AgentPrompts'
import { BlockForm, type Values } from './BlockForm'
import { BlockList } from './BlockList'

type View = 'page' | 'phone' | 'list'
/** The block in the edit panel: an existing one, or a new one going in at `at`. */
type Editing = { id: string; type: EditableType } | { id: null; type: EditableType; at: number }
type CanvasBlock = Block & { index: number | null; hidden: boolean }
const NEW_ID = 'new-block'

const toBlock = (id: string, type: string, sectionLabel: string | null, data: Record<string, unknown>) =>
  ({ id, type, sectionLabel, data: withDefaults(type, data) }) as Block
const rowValues = (row: BlockRow): Values => ({ section_label: row.section_label ?? '', ...row.data })
const splitValues = ({ section_label, ...data }: Values) => ({ sectionLabel: String(section_label ?? '').trim() || null, data: cleanData(data) as Record<string, unknown> })

/**
 * The case study editor (ported from the portfolio's CaseStudyStudio): the
 * page as visitors see it, every block editable. Click a block to edit it in
 * the side panel (the page updates as you type; Save puts it live). Phone
 * shows the saved public page at phone width; List is the compact view (drag
 * to reorder). Writes go through Supabase with the signed-in session (Row
 * Level Security), then the public pages refresh.
 */
export function CaseStudyStudio({ project, onClose }: { project: Project; onClose: () => void }) {
  const devices = projectDevices(project)
  const [rows, setRows] = useState<BlockRow[] | null>(null)
  const [view, setView] = useState<View>('page')
  const [editing, setEditing] = useState<Editing | null>(null)
  const [draft, setDraft] = useState<Values>({})
  const [adding, setAdding] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [previewVersion, setPreviewVersion] = useState(0)

  // What the public page shows while the project has no stored blocks.
  const current = useMemo(() => {
    const bundled = bundledBlocks(project)
    return bundled ? { blocks: bundled, from: `the ${project.name} case study bundled with the site` } : { blocks: blocksFromProject(project), from: 'this project’s details' }
  }, [project])

  const load = useCallback(async () => {
    try { setRows(await fetchCaseStudyBlocks(project.id)); setError('') } catch (e) { setError(e instanceof Error ? e.message : 'Could not load the case study.') }
  }, [project.id])
  useEffect(() => { const t = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(t) }, [load])

  // Bring the block being edited into view beside the panel.
  useEffect(() => {
    if (!editing) return
    const id = editing.id ?? NEW_ID
    requestAnimationFrame(() => document.querySelector(`[data-block="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }, [editing])

  const run = async (task: () => Promise<void>, done?: string) => {
    setBusy(true); setError(''); setStatus('')
    try { await task(); if (done) setStatus(done); setPreviewVersion(v => v + 1) } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') } finally { setBusy(false) }
  }

  const close = () => { setEditing(null); setDraft({}) }
  const openEdit = (row: BlockRow) => {
    if (!isEditable(row.block_type)) return
    setAdding(null); setStatus(''); setDraft(rowValues(row)); setEditing({ id: row.id, type: row.block_type })
  }
  const openNew = (preset: Preset, at: number) => {
    setAdding(null); setStatus(''); setDraft({ section_label: preset.sectionLabel ?? '', ...preset.data }); setEditing({ id: null, type: preset.type, at })
  }

  const saveOrder = (next: BlockRow[]) => {
    const before = rows
    setRows(next)
    void run(async () => {
      try { await reorderCaseStudyBlocks(project.id, next.map(row => row.id)) } catch (e) { setRows(before); throw e }
    }, 'Order saved.')
  }
  const move = (index: number, by: -1 | 1) => {
    if (!rows) return
    const next = [...rows]
    ;[next[index], next[index + by]] = [next[index + by], next[index]]
    saveOrder(next)
  }
  const toggle = (row: BlockRow) => void run(async () => {
    await setCaseStudyBlockPublished(row.id, !row.is_published)
    setRows(all => all?.map(r => (r.id === row.id ? { ...r, is_published: !row.is_published } : r)) ?? null)
  }, row.is_published ? 'Block hidden from the live page.' : 'Block shown on the live page.')
  const remove = (row: BlockRow) => {
    if (!window.confirm(`Delete this ${blockLabel({ type: row.block_type, data: row.data } as Block)} block? This can’t be undone.`)) return
    if (editing?.id === row.id) close()
    void run(async () => {
      await deleteCaseStudyBlock(row.id)
      setRows(all => all?.filter(r => r.id !== row.id) ?? null)
    }, 'Block deleted.')
  }

  const save = async () => {
    const target = editing
    if (!target || !rows) return
    setSaving(true); setError(''); setStatus('')
    try {
      const { sectionLabel, data } = splitValues(draft)
      if (target.id !== null) {
        const base = rows.find(row => row.id === target.id)?.data ?? {}
        const saved = await updateCaseStudyBlock(target.id, { sectionLabel, data: { ...base, ...data } })
        setRows(all => all?.map(row => (row.id === saved.id ? saved : row)) ?? null)
        setDraft(rowValues(saved))
      } else {
        const saved = await insertCaseStudyBlock(project.id, { type: target.type, sectionLabel, data }, target.at + 1)
        const next = [...rows]
        next.splice(target.at, 0, saved)
        await reorderCaseStudyBlocks(project.id, next.map(row => row.id))
        setRows(next)
        setDraft(rowValues(saved))
        setEditing({ id: saved.id, type: target.type })
      }
      setStatus('Saved. The live page is updated.')
      setPreviewVersion(v => v + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.')
    } finally { setSaving(false) }
  }

  const startFrom = () => void run(async () => {
    const blocks = current.blocks.map(block => ({ ...block, data: { ...block.data } }) as Block)
    setRows(await startCaseStudyFrom(project.id, blocks))
  }, 'Blocks created. The live page looks the same; edit any block and save.')

  const stored = rows ?? []
  const hasRows = stored.length > 0

  // The blocks the page view draws: stored rows (the one being edited from its draft), or what the page shows now.
  const canvas: CanvasBlock[] = hasRows
    ? stored.map((row, index) => {
      const live = editing?.id === row.id
      const values = live ? splitValues(draft) : { sectionLabel: row.section_label, data: row.data }
      return { ...toBlock(row.id, row.block_type, values.sectionLabel, live ? { ...row.data, ...values.data } : row.data), index, hidden: !row.is_published }
    })
    : current.blocks.map(block => ({ ...block, index: null, hidden: false }))
  if (editing && editing.id === null) {
    const values = splitValues(draft)
    canvas.splice(editing.at, 0, { ...toBlock(NEW_ID, editing.type, values.sectionLabel, values.data), index: null, hidden: false })
  }

  const cover = canvas.find(block => block.type === 'cover')
  const sections = toSections(canvas)
  const live = liveSiteUrl(project)
  const isPublic = project.isPublished !== false && hasCaseStudy(project)
  const flows = stored.filter(row => row.block_type === 'flow').map(row => {
    const data = row.data as { number?: string; title?: string; steps?: { caption?: string }[] }
    return { number: data.number ?? '', title: data.title ?? '', steps: (data.steps ?? []).map(step => step.caption ?? '') }
  })
  const editingRow = editing?.id ? stored.find(row => row.id === editing.id) : undefined

  const wrap = (block: CanvasBlock, content: ReactNode) => {
    const row = block.index === null ? undefined : stored[block.index]
    const i = block.index
    return (
      <Editable
        key={block.id}
        id={block.id}
        label={blockLabel(block)}
        hidden={block.hidden}
        active={!!editing && (editing.id ?? NEW_ID) === block.id}
        onEdit={row && isEditable(row.block_type) ? () => openEdit(row) : undefined}
        onUp={row && i !== null && block.type !== 'cover' && i > 0 && stored[i - 1].block_type !== 'cover' ? () => move(i, -1) : undefined}
        onDown={row && i !== null && block.type !== 'cover' && i < stored.length - 1 ? () => move(i, 1) : undefined}
        onToggle={row ? () => toggle(row) : undefined}
        onDelete={row ? () => remove(row) : undefined}
        onAdd={row && i !== null ? () => setAdding(i + 1) : undefined}
        picker={adding !== null && i !== null && adding === i + 1 ? <AddPicker onPick={preset => openNew(preset, i + 1)} onCancel={() => setAdding(null)} /> : null}
      >
        {content}
      </Editable>
    )
  }

  return (
    <section className={editing && view === 'page' ? 'min-[1280px]:pr-[min(440px,34vw)]' : ''} aria-labelledby="cs-studio-title">
      <div className="admin-section-heading">
        <p className="eyebrow">Case study</p>
        <h2 id="cs-studio-title">{project.name}</h2>
        <span>The page as visitors see it. Click a block to edit it; the page updates as you type, and Save puts it live. A block with a section pill starts a new section.</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button type="button" className="admin-secondary-button" onClick={onClose}>← Back to projects</button>
        {isPublic ? <a className="admin-secondary-button no-underline" href={`/work/${project.id}`} target="_blank" rel="noopener noreferrer">View live page ↗</a> : null}
      </div>
      {!isPublic ? (
        <p className="mb-5 rounded-md border border-bbw-border-hi bg-bbw-surface px-4 py-3 text-[13px] text-bbw-fg">
          {project.isPublished === false ? 'This project is hidden, so its page isn’t public. Show it in the project list to publish it.' : 'Coming-soon products have no public page yet. Change the status to publish it.'}
        </p>
      ) : null}

      <div className="mb-6">
        <AgentPrompts
          project={{ name: project.name, typeLabel: typeLabel(projectTypeOf(project)), projectType: projectTypeOf(project), webRole: project.webRole ?? null, isOwn: project.isOwn, liveUrl: live, tagline: project.tagline }}
          devices={devices}
          flows={flows}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Editor view" className="inline-flex rounded-full border border-bbw-border-hi bg-bbw-surface p-1">
          {([['page', 'Page'], ['phone', 'Phone'], ['list', 'List']] as const).map(([value, label]) => (
            <button key={value} type="button" role="tab" aria-selected={view === value} onClick={() => { setView(value); close() }} className={`min-h-9 rounded-full px-4 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${view === value ? 'bg-bbw-accent text-white' : 'text-bbw-muted hover:text-bbw-fg'}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-bbw-muted">
          {view === 'page' ? 'Click any block to edit it. Hover (or tap) for move, hide, delete and + Add block.' : view === 'phone' ? 'The saved live page at phone width. It updates after each save.' : 'Drag the handle to reorder. Open a block to edit it.'}
        </p>
      </div>

      {error ? <p role="alert" className="mb-4 text-[13px] text-[#ef4444]">{error}</p> : null}
      {status ? <p role="status" className="mb-4 text-[13px] text-bbw-accent">{status}</p> : null}

      {rows === null && !error ? <p className="admin-empty-state">Loading the case study…</p> : null}

      {rows !== null && !hasRows ? (
        <div className="mb-6 flex flex-col items-start gap-3 rounded-lg border border-bbw-accent/40 bg-bbw-accent-dim p-5">
          <p className="text-[15px] font-semibold text-bbw-fg">No blocks are stored for this case study yet.</p>
          <p className="max-w-[70ch] text-[13px] leading-[1.6] text-bbw-muted">The live page is built from {current.from}, as shown below. Start from it to edit it here: the blocks are created exactly as the page shows them now, so nothing changes on the live page until you save an edit.</p>
          <button type="button" className="btn-primary px-5! py-2.5! text-[13px]!" disabled={busy} onClick={startFrom}>{busy ? 'Creating…' : `Start from ${current.blocks.length ? 'what the page shows now' : 'an empty case study'}`}</button>
        </div>
      ) : null}

      {rows === null ? null : view === 'list' ? (
        hasRows ? (
          <BlockList rows={stored} onReorder={saveOrder} onEdit={row => { setView('page'); openEdit(row) }} onToggle={toggle} onDelete={remove} />
        ) : null
      ) : view === 'phone' ? (
        isPublic ? (
          <div className="flex justify-center">
            {/* The screen is 94% of the frame: 415px gives the page a 390px phone width. */}
            <PhoneFrame className="w-[415px] max-w-full">
              <iframe key={previewVersion} src={`/work/${project.id}`} title={`${project.name} at phone width`} className="size-full bg-bbw-bg" />
            </PhoneFrame>
          </div>
        ) : <p className="admin-empty-state">The phone preview shows the live page, and this project’s page isn’t public.</p>
      ) : (
        // The canvas: the public page's own cover, sections and blocks.
        <div className={`overflow-hidden rounded-lg border border-bbw-border-hi bg-bbw-bg pb-16 ${hasRows ? '' : 'opacity-80'}`}>
          {cover?.type === 'cover' ? (
            hasRows ? wrap(cover, <CoverView project={project} data={cover.data} />) : <CoverView project={project} data={cover.data} />
          ) : (
            <div className="container-site pt-10">
              <h3 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.95] font-bold text-bbw-fg">{project.name}</h3>
              {hasRows ? <button type="button" className="admin-secondary-button mt-4" onClick={() => openNew(COVER_PRESET, 0)}>+ Add cover</button> : null}
            </div>
          )}
          <div className="container-site">
            {sections.map((section, i) => (
              <section key={section.id ?? `intro-${i}`} className={sectionClass(i)}>
                {section.blocks.map((block, j) => {
                  const content = <CaseStudyBlock block={block} section={j === 0 ? (section.id ? true : 'intro') : false} devices={devices} />
                  return hasRows ? wrap(block, content) : <div key={block.id} className="pointer-events-none">{content}</div>
                })}
              </section>
            ))}
            {hasRows && sections.length === 0 ? (
              <div className="py-12"><AddPicker onPick={preset => openNew(preset, stored.length)} /></div>
            ) : null}
          </div>
        </div>
      )}

      {editing && view === 'page' ? (
        <aside aria-label="Edit block" className="fixed inset-y-0 right-0 z-[600] flex w-[min(440px,100vw)] flex-col border-l border-bbw-border-hi bg-bbw-surface shadow-2xl min-[1280px]:w-[min(440px,34vw)]">
          <div className="flex items-center justify-between gap-3 border-b border-bbw-border px-5 py-4">
            <h3 className="text-[16px] font-semibold text-bbw-fg">{editing.id ? 'Edit' : 'New'} · {blockLabel({ type: editing.type, data: draft } as Block)}</h3>
            <button type="button" className="admin-secondary-button" onClick={close}>Close</button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-5">
            {status ? <p role="status" className="mb-4 text-[12px] text-bbw-accent">{status}</p> : null}
            {error ? <p role="alert" className="mb-4 text-[12px] text-[#ef4444]">{error}</p> : null}
            <BlockForm
              key={editing.id ?? `new-${editing.at}`}
              fields={[SECTION_FIELD, ...blockFields(editing.type, devices)]}
              values={draft}
              onChange={setDraft}
              onSave={save}
              onCancel={close}
              onDelete={editingRow ? () => remove(editingRow) : undefined}
              saving={saving}
            />
          </div>
        </aside>
      ) : null}
    </section>
  )
}

function CoverView({ project, data }: { project: Project; data: Extract<Block, { type: 'cover' }>['data'] }) {
  return <Cover name={project.name} data={data} devices={projectDevices(project)} fallbackScreen={kind => <DrawnScreen project={project} kind={kind} />} />
}

const tool = 'inline-flex min-h-8 items-center rounded-full px-2.5 font-mono text-[10px] tracking-[0.08em] uppercase text-bbw-muted transition-colors hover:bg-bbw-surface2 hover:text-bbw-fg disabled:opacity-30'

/** One block on the canvas: click to edit; a toolbar on hover (always shown on touch screens); "+ Add block" below. */
function Editable({ id, label, hidden, active, onEdit, onUp, onDown, onToggle, onDelete, onAdd, picker, children }: {
  id: string; label: string; hidden: boolean; active: boolean
  onEdit?: () => void; onUp?: () => void; onDown?: () => void; onToggle?: () => void; onDelete?: () => void; onAdd?: () => void
  picker: ReactNode; children: ReactNode
}) {
  const stop = (fn?: () => void) => (event: React.MouseEvent) => { event.stopPropagation(); fn?.() }
  return (
    <div data-block={id} onClick={onEdit} className={`group relative rounded-[14px] outline-2 outline-offset-[10px] ${onEdit ? 'cursor-pointer' : ''} ${active ? 'outline outline-bbw-accent' : 'outline-dashed outline-transparent hover:outline-bbw-accent/50'}`}>
      <div className={`pointer-events-none ${hidden ? 'opacity-40' : ''}`}>{children}</div>
      <div className={`absolute -top-5 right-2 z-20 flex flex-wrap items-center gap-0.5 rounded-full border border-bbw-border-hi bg-bbw-surface p-1 shadow-lg transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100'}`}>
        <span className="px-2 font-mono text-[10px] tracking-[0.08em] text-bbw-muted uppercase">{label}{hidden ? <span className="ml-1.5 text-bbw-accent">· Hidden</span> : null}</span>
        {onEdit ? <button type="button" onClick={stop(onEdit)} className={tool}>Edit</button> : null}
        <button type="button" onClick={stop(onUp)} disabled={!onUp} className={tool} aria-label={`Move ${label} up`}>↑</button>
        <button type="button" onClick={stop(onDown)} disabled={!onDown} className={tool} aria-label={`Move ${label} down`}>↓</button>
        {onToggle ? <button type="button" onClick={stop(onToggle)} className={tool}>{hidden ? 'Show' : 'Hide'}</button> : null}
        {onDelete ? <button type="button" onClick={stop(onDelete)} className={`${tool} hover:text-[#ef4444]`}>Delete</button> : null}
      </div>
      {onAdd ? (
        <div className="absolute inset-x-0 -bottom-12 z-20 flex justify-center" onClick={event => event.stopPropagation()}>
          {picker ?? <button type="button" onClick={onAdd} className="admin-secondary-button bg-bbw-surface opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100">+ Add block</button>}
        </div>
      ) : null}
    </div>
  )
}

/** Choose which of the agency layout's blocks to add. */
function AddPicker({ onPick, onCancel }: { onPick: (preset: Preset) => void; onCancel?: () => void }) {
  const [key, setKey] = useState(PRESETS[0].key)
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-bbw-border-hi bg-bbw-surface p-1.5 shadow-lg">
      <label className="sr-only" htmlFor="cs-add-block">Block to add</label>
      <select id="cs-add-block" value={key} onChange={event => setKey(event.target.value)} className="min-h-9 rounded-full border border-bbw-border-hi bg-bbw-surface2 px-3 text-[13px] text-bbw-fg">
        {PRESETS.map(preset => <option key={preset.key} value={preset.key}>{preset.label}</option>)}
      </select>
      <button type="button" className="btn-primary min-h-9 px-4! py-1.5! text-[12px]!" onClick={() => onPick(PRESETS.find(preset => preset.key === key) ?? PRESETS[0])}>Add</button>
      {onCancel ? <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button> : null}
    </div>
  )
}
