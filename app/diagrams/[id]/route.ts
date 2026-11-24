import { getDiagramDrawing } from '@/lib/case-studies/diagram-drawing'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * A case study diagram's drawing, fetched by the page when the diagram nears
 * the screen (so the drawings aren't part of the page itself).
 */
export async function GET(_request: Request, { params }: RouteContext<'/diagrams/[id]'>) {
  const { id } = await params
  if (!UUID.test(id)) return new Response('Not found', { status: 404 })
  const drawing = await getDiagramDrawing(id)
  if (!drawing) return new Response('Not found', { status: 404 })
  return Response.json(drawing, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
