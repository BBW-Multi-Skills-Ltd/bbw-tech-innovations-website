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
const BEVEL_THICKNESS = 7
const BEVEL_SIZE = 3
/** The swoosh sits in front of the letters (it passes over the second B's corner). */
const SWOOSH_FORWARD = 14

/** Distance from the centre to the front-most face (the swoosh's). */
export const LOGO_FRONT = DEPTH / 2 + BEVEL_THICKNESS + SWOOSH_FORWARD

// Glossy brand-blue metal, like bbwlogo.png: cyan highlights at the top,
// brand blue through the middle, deep navy at the bottom (sRGB, top → bottom).
const GRADIENT: [number, string][] = [
  [0, '#22c4ff'],
  [0.3, '#167aff'],
  [0.6, '#0b5aff'],
  [0.85, '#0640d4'],
  [1, '#031f8c'],
]
const stops = GRADIENT.map(([t, hex]) => [t, new THREE.Color(hex)] as const)

function gradientAt(t: number, out: THREE.Color) {
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
      bevelSegments: 6,
    })
    geometry.translate(0, 0, -DEPTH / 2 + (id === 'swoosh' ? SWOOSH_FORWARD : 0))
    geometry.computeVertexNormals()

    const position = geometry.getAttribute('position')
    const colors = new Float32Array(position.count * 3)
    const color = new THREE.Color()
    for (let i = 0; i < position.count; i++) {
      const t = THREE.MathUtils.clamp((LOGO_VIEW_H / 2 - position.getY(i)) / LOGO_VIEW_H, 0, 1)
      gradientAt(t, color).toArray(colors, i * 3)
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
          <meshPhysicalMaterial
            vertexColors
            metalness={0.5}
            roughness={0.24}
            clearcoat={0.7}
            clearcoatRoughness={0.06}
            envMapIntensity={1.35}
          />
        </mesh>
      ))}
    </>
  )
}

/** Cool studio for the glossy blue: a bright key from the top left, cyan rim, soft front fill. */
export function LogoStudio() {
  return (
    <>
      <hemisphereLight args={['#e8f4ff', '#020818', 0.6]} />
      <directionalLight color="#d6ecff" intensity={2.2} position={[-500, 700, 800]} />
      <directionalLight color="#59c8ff" intensity={2.2} position={[700, 200, -600]} />
      <Environment frames={1} resolution={256}>
        <color attach="background" args={['#030714']} />
        <Lightformer form="rect" intensity={2} color="#cde8ff" scale={[90, 40, 1]} position={[-60, 80, 60]} rotation-x={Math.PI / 4} />
        <Lightformer form="rect" intensity={2.2} color="#7fd6ff" scale={[24, 140, 1]} position={[90, 10, -10]} rotation-y={-Math.PI / 2.4} />
        <Lightformer form="rect" intensity={1.4} color="#2979ff" scale={[200, 24, 1]} position={[0, -70, 0]} rotation-x={Math.PI / 2} />
        {/* Wide, soft front fill: the logo walks across the hero and stands low,
            so its metal must find this from any angle (or it mirrors the dark studio). */}
        <Lightformer form="rect" intensity={0.6} color="#4a90ff" scale={[420, 260, 1]} position={[0, -10, 140]} />
        {/* White strip overhead: the top bevels catch it, like the original's bright edges. */}
        <Lightformer form="rect" intensity={3} color="#ffffff" scale={[180, 10, 1]} position={[0, 110, 30]} rotation-x={Math.PI / 2} />
      </Environment>
    </>
  )
}
