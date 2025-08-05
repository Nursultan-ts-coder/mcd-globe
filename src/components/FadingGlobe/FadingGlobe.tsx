import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import countriesGeoJson from '../../const/geojson.json'
import { FillCountries } from './FillCountries'

export default function FadingGlobe() {
  const material = new THREE.MeshStandardMaterial({
    color: '#0a8',
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })

  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <FillCountries json={countriesGeoJson as any} radius={1.01} material={material} />
      <OrbitControls />
    </Canvas>
  )
}
