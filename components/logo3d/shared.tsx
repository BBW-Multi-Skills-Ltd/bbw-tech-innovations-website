'use client'

import { Environment, Lightformer } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { LOGO_URL, LOGO_VIEW_H, LOGO_VIEW_W } from '@/lib/bbw-logo'

// The 3D BBW logo, extruded from public/logos/bbw-logo.svg (three paths:
// #swoosh, #b, #w), in the SVG's own units: the viewBox (1557 × 777) is
// centred on 0,0 with y up. The hero sizes it from the viewBox height.

const DEPTH = 44
const BEVEL_THICKNESS = 11
/** The bevel is cut inward (bevelOffset = -size): the silhouette stays exactly the SVG's,
 * and the rounded edge is wide enough to catch the strip lights. */
const BEVEL_SIZE = 10
/** The swoosh sits in front of the letters (it passes over the second B's corner). */
const SWOOSH_FORWARD = 14

/** Distance from the centre to the front-most face (the swoosh's). */
export const LOGO_FRONT = DEPTH / 2 + BEVEL_THICKNESS + SWOOSH_FORWARD

// Deep, saturated royal-blue metal, like bbwlogo.png (sRGB, top → bottom over
// the letters' height). The letters go to dark navy at their bottoms; the
// swoosh stays vivid royal blue all the way round (its top arc is the
// brightest part, above the letters).
const LETTER_GRADIENT: [number, string][] = [
  [0, '#2a7dff'],
  [0.3, '#1258ff'],
  [0.55, '#0a3ee0'],
  [0.75, '#061d84'],
  [0.9, '#030e4a'],
  [1, '#010524'],
]
const SWOOSH_GRADIENT: [number, string][] = [
  [0, '#2a7dff'],
  [0.3, '#1258ff'],
  [0.6, '#0a46f0'],
  [1, '#0a40e4'],
]
/** The letters' top and bottom in SVG units (the B, B and W share them). */
const LETTERS_TOP = 239.5
const LETTERS_BOTTOM = 622.2
/**
 * The first B is part of the #swoosh path (the swoosh is its spine), so it is
 * picked out by area: swoosh vertices inside this box (SVG units) take the
 * letters' gradient.
 */
const FIRST_B = { left: 165, right: 600 }
/** The sides (extruded walls, the swoosh's inner face) are this much of the front colour: deep navy. */
const SIDE_SHADE = 0.22

type Stops = (readonly [number, THREE.Color])[]
const toStops = (gradient: [number, string][]): Stops => gradient.map(([t, hex]) => [t, new THREE.Color(hex)] as const)
const letterStops = toStops(LETTER_GRADIENT)
const swooshStops = toStops(SWOOSH_GRADIENT)

function gradientAt(stops: Stops, t: number, out: THREE.Color) {
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i]
    if (t <= t1) {
      const [t0, c0] = stops[i - 1]
      return out.copy(c0).lerp(c1, (t - t0) / (t1 - t0))
    }
  }
  return out.copy(stops[stops.length - 1][1])
}

/** The SVG's shapes, flipped to y-up and centred on the viewBox. */
function flipShape(shape: THREE.Shape) {
  const flip = (points: THREE.Vector2[]) => points.map(p => new THREE.Vector2(p.x - LOGO_VIEW_W / 2, LOGO_VIEW_H / 2 - p.y))
  const out = new THREE.Shape(flip(shape.getPoints()))
  out.holes = shape.holes.map(hole => new THREE.Path(flip(hole.getPoints())))
  return out
}

/** One extruded geometry per SVG path, coloured top to bottom by the gradient. */
export function useLogoGeometries() {
  const text = useLoader(THREE.FileLoader, LOGO_URL) as string
  return useMemo(() => {
    // The file fills with currentColor (for CSS use), which three can't read.
    const svg = new SVGLoader().parse(text.replaceAll('currentColor', '#000'))
    return svg.paths.map(path => {
    const id = (path.userData?.node as Element | undefined)?.id ?? ''
    const shapes = path.toShapes().map(flipShape)
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: DEPTH,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: BEVEL_THICKNESS,
      bevelSize: BEVEL_SIZE,
      bevelOffset: -BEVEL_SIZE,
      bevelSegments: 8,
    })
    geometry.translate(0, 0, -DEPTH / 2 + (id === 'swoosh' ? SWOOSH_FORWARD : 0))
    geometry.computeVertexNormals()

    // Vertex colours: the gradient by height, darkened on the sides by how
    // far each face turns away from the front (the bevels sit in between).
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const colors = new Float32Array(position.count * 3)
    const color = new THREE.Color()
    for (let i = 0; i < position.count; i++) {
      const svgY = LOGO_VIEW_H / 2 - position.getY(i)
      const t = THREE.MathUtils.clamp((svgY - LETTERS_TOP) / (LETTERS_BOTTOM - LETTERS_TOP), 0, 1)
      // Bevels (half facing) stay mid-tone so they show the strip highlights.
      const facing = Math.abs(normal.getZ(i)) ** 1.5
      const svgX = position.getX(i) + LOGO_VIEW_W / 2
      const inFirstB = svgX >= FIRST_B.left && svgX <= FIRST_B.right && svgY >= LETTERS_TOP && svgY <= LETTERS_BOTTOM
      const stops = id === 'swoosh' && !inFirstB ? swooshStops : letterStops
      gradientAt(stops, t, color).multiplyScalar(SIDE_SHADE + (1 - SIDE_SHADE) * facing).toArray(colors, i * 3)
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { id, geometry }
    })
  }, [text])
}

/** The logo's meshes; the group is in SVG units, centred on the viewBox. */
export function LogoMeshes() {
  const parts = useLogoGeometries()
  return (
    <>
      {parts.map(({ id, geometry }) => (
        <mesh key={id} geometry={geometry}>
          {/* Full metal: every colour is a reflection tinted by the vertex colours
              (no diffuse to wash it out), so the edge highlights come out
              cyan-blue; a light clear coat adds a little white shine. */}
          <meshPhysicalMaterial
            vertexColors
            metalness={1}
            roughness={0.22}
            clearcoat={0.35}
            clearcoatRoughness={0.28}
            envMapIntensity={1}
          />
        </mesh>
      ))}
    </>
  )
}

/**
 * Dark studio with strip lights. A blue front fill shows the front faces'
 * gradient (the metal takes its colour; a white fill would haze the clear coat); thin strips above and to the sides
 * light the bevels and the swoosh's top edge in cyan and white; nothing
 * lights the sides or bottom, so they stay deep navy.
 */
export function LogoStudio() {
  return (
    <>
      <hemisphereLight args={['#cfe6ff', '#01040f', 0.12]} />
      <directionalLight color="#e6f3ff" intensity={0.5} position={[-400, 600, 900]} />
      {/* Edge lights: their sharp specular highlights on the clear coat land
          where a bevel turns halfway to them, drawing bright lines along the
          top edges (white) and the side edges (cyan). */}
      <directionalLight color="#ffffff" intensity={14} position={[0, 1000, 450]} />
      <directionalLight color="#7fe0ff" intensity={9} position={[-1000, 250, 450]} />
      <directionalLight color="#5ccbff" intensity={7} position={[1000, 150, 450]} />
      <Environment frames={1} resolution={512}>
        <color attach="background" args={['#01030c']} />
        {/* Wide, soft front fill (the logo walks and stands low, so it must
            find this from any angle, or it mirrors the dark studio). */}
        <Lightformer form="rect" intensity={1.4} color="#4590ff" scale={[420, 240, 1]} position={[0, -20, 140]} />
        {/* Edge strips: overhead (top bevels, the swoosh's top edge), and
            either side (the side bevels). */}
        <Lightformer form="rect" intensity={40} color="#ffffff" scale={[400, 30, 1]} position={[0, 130, 20]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={14} color="#6fdcff" scale={[400, 18, 1]} position={[0, 110, 70]} rotation-x={Math.PI / 3} />
        <Lightformer form="rect" intensity={30} color="#8fe4ff" scale={[20, 300, 1]} position={[-130, 0, 20]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={24} color="#5fc8ff" scale={[20, 300, 1]} position={[130, 0, 20]} rotation-y={-Math.PI / 2} />
      </Environment>
    </>
  )
}
