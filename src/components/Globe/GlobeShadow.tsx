import * as THREE from 'three'

export function GlobeShadow({ radius = 2.1 }) {
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 'black',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
      <ringGeometry args={[radius, radius + 0.3, 64]} />
      <primitive object={shadowMaterial} attach="material" />
    </mesh>
  )
}
