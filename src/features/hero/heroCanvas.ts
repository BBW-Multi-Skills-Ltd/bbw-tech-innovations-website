type Painter = (alpha: number) => void

export function createHeroPainters(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dark: boolean): Painter[] {
  const cell = 64
  const line = dark ? 'rgba(240,240,238,0.058)' : 'rgba(10,10,11,0.058)'
  const dot = dark ? 'rgba(240,240,238,0.12)' : 'rgba(10,10,11,0.12)'
  const coordinates = (offset = 0) => {
    const points: [number, number][] = []
    for (let x = offset; x <= canvas.width + cell; x += cell) {
      for (let y = offset; y <= canvas.height + cell; y += cell) points.push([x, y])
    }
    return points
  }
  const prepare = (alpha: number) => {
    context.globalAlpha = alpha
    context.strokeStyle = line
    context.lineWidth = 1
  }

  return [
    alpha => {
      prepare(alpha)
      for (let x = 0; x <= canvas.width + cell; x += cell) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke()
      }
      for (let y = 0; y <= canvas.height + cell; y += cell) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke()
      }
    },
    alpha => {
      context.globalAlpha = alpha
      context.fillStyle = dot
      coordinates().forEach(([x, y]) => { context.beginPath(); context.arc(x, y, 2, 0, Math.PI * 2); context.fill() })
    },
    alpha => {
      prepare(alpha)
      const radius = cell * 0.38
      coordinates(cell / 2).forEach(([x, y]) => {
        context.beginPath(); context.moveTo(x, y - radius); context.lineTo(x + radius, y)
        context.lineTo(x, y + radius); context.lineTo(x - radius, y); context.closePath(); context.stroke()
      })
    },
    alpha => {
      prepare(alpha)
      coordinates(cell / 2).forEach(([x, y]) => { context.beginPath(); context.arc(x, y, cell * 0.34, 0, Math.PI * 2); context.stroke() })
    },
    alpha => {
      prepare(alpha)
      const arm = cell * 0.28
      coordinates().forEach(([x, y]) => {
        context.beginPath(); context.moveTo(x - arm, y); context.lineTo(x + arm, y)
        context.moveTo(x, y - arm); context.lineTo(x, y + arm); context.stroke()
      })
    },
  ]
}
