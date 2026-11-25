'use client'

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useId } from 'react'
import type { BlockRow } from '@/lib/cms/caseStudyRepository'
import { blockLabel, blockSummary, isEditable } from '@/lib/case-studies/editor-fields'
import type { Block } from '@/lib/case-studies/types'

/**
 * The compact view: every block as a row. Drag the handle to reorder (mouse,
 * touch or keyboard), show or hide a block, open it to edit, delete it.
 */
export function BlockList({
  rows,
  onReorder,
  onEdit,
  onToggle,
  onDelete,
}: {
  rows: BlockRow[]
  onReorder: (rows: BlockRow[]) => void
  onEdit: (row: BlockRow) => void
  onToggle: (row: BlockRow) => void
  onDelete: (row: BlockRow) => void
}) {
  const dndId = useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    onReorder(arrayMove(rows, rows.findIndex(row => row.id === active.id), rows.findIndex(row => row.id === over.id)))
  }

  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={rows.map(row => row.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {rows.map(row => <SortableBlockRow key={row.id} row={row} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />)}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

function SortableBlockRow({ row, onEdit, onToggle, onDelete }: { row: BlockRow; onEdit: (row: BlockRow) => void; onToggle: (row: BlockRow) => void; onDelete: (row: BlockRow) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })
  const label = blockLabel({ type: row.block_type, data: row.data } as Pick<Block, 'type' | 'data'>)
  const summary = blockSummary(row.data)
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`admin-project-row ${isDragging ? 'relative z-10 shadow-xl' : ''} ${row.is_published ? '' : 'is-hidden'}`}>
      <button type="button" {...attributes} {...listeners} aria-label={`Drag to reorder: ${label}`} className="flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded border border-bbw-border text-bbw-muted active:cursor-grabbing">
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <div>
        <h3>{row.section_label ? `${row.section_label} · ${label}` : label}</h3>
        <p>{summary ? <span className="line-clamp-1">{summary}</span> : null}{row.is_published ? null : <span>Hidden</span>}</p>
      </div>
      <div className="admin-project-row-actions">
        {isEditable(row.block_type) ? <button type="button" onClick={() => onEdit(row)}>Edit</button> : null}
        <button type="button" onClick={() => onToggle(row)}>{row.is_published ? 'Hide' : 'Show'}</button>
        <button type="button" className="is-danger" onClick={() => onDelete(row)}>Delete</button>
      </div>
    </li>
  )
}
