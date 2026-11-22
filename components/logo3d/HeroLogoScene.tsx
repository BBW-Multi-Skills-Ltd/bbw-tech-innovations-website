'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { LOGO_VIEW_H } from '@/lib/bbw-logo'
import { LOGO_FRONT, LogoMeshes, LogoStudio } from './shared'

/**
 * Where the hero wants the logo, in CSS pixels of the canvas, written by the
 * walk (useLogoWalk) every frame. The scene only reads it.
 */
export type LogoPose = {
  /** Centre of the logo's box, from the canvas's left edge. */
  x: number
  /** The floor line, from the canvas's top edge. The logo's box stands on it. */
  floor: number
  /** Height of the logo's box (the SVG viewBox) in px. */
  height: number
  /** Rotation in radians. */
  yaw: number
  lean: number
  tilt: number
  /** Lift off the floor in px. */
  hop: number
}

const FOV = 30
const CAMERA_Z = 1400

function Logo({ pose, onReady }: { pose: RefObject<LogoPose>; onReady: () => void }) {
  const group = useRef<THREE.Group>(null)
  const frames = useRef(0)

  useFrame(({ size }) => {
    const g = group.current
    const p = pose.current
    if (!g || !p) return
    // World units per CSS pixel on the z = 0 plane.
    const unitsPerPx = (2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) / size.height
    const scale = (p.height * unitsPerPx) / LOGO_VIEW_H
    g.scale.setScalar(scale)
    // Push it back so the front face sits on the z = 0 plane: then it is
    // exactly p.height tall and stands on the floor line.
    g.position.set(
      (p.x - size.width / 2) * unitsPerPx,
      (size.height / 2 - p.floor + p.hop) * unitsPerPx + (LOGO_VIEW_H * scale) / 2,
      -LOGO_FRONT * scale,
    )
    g.rotation.set(p.tilt, p.yaw, p.lean)

    // The environment bakes on the first frame; swap from the still logo after.
    if (frames.current < 3 && ++frames.current === 3) onReady()
  })

  return (
    <group ref={group}>
      <LogoMeshes />
    </group>
  )
}

/** Full-size transparent canvas with the 3D logo wherever the pose says. */
export default function HeroLogoScene({
  pose,
  frameloop,
  onReady,
  preserveDrawingBuffer = false,
}: {
  pose: RefObject<LogoPose>
  /** "never" off screen; "demand" once static (reduced motion). */
  frameloop: 'always' | 'demand' | 'never'
  onReady: () => void
  /** Only for capturing the still render. */
  preserveDrawingBuffer?: boolean
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer }}
      camera={{ fov: FOV, near: 10, far: 4000, position: [0, 0, CAMERA_Z] }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
        gl.toneMappingExposure = 1
      }}
    >
      <LogoStudio />
      <Suspense fallback={null}>
        <Logo pose={pose} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
