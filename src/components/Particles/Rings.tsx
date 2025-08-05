import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import './styles.css'

export const BasicParticles = () => {
  // This reference gives us direct access to our points
  const points = useRef(null)

  // You can see that, like our mesh, points also takes a geometry and a material,
  // but a specific material => pointsMaterial
  return (
    <points ref={points}>
      <sphereGeometry args={[2.3, 48, 48]} />
      <pointsMaterial color="#5786F5" size={0.001} sizeAttenuation />
    </points>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
      <ambientLight intensity={0.5} />
      <BasicParticles />
      <OrbitControls autoRotate />
    </Canvas>
  )
}

export default Scene
