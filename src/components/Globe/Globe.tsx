import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { FillCountries } from '../../FillCountries'
import { BasicParticles } from '../Particles/Rings'
import geoJson from '../../const/geojson.json' // Or fetch it dynamically

const globeGeometry = new THREE.SphereGeometry(1, 64, 64)

const radius = 2

function GlobeEdges() {
  const geo = new THREE.SphereGeometry(radius)
  const edges = new THREE.EdgesGeometry(geo, 1)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  })

  return <lineSegments geometry={edges} material={lineMat} />
}

export default function Globe() {
  // useEffect(() => {
  //   async function loadData() {
  //     setLoading(true)
  //     const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  //     const json = await res.json()
  //     setGeojson(json)
  //     setLoading(false)
  //   }
  //   loadData()
  // }, [])

  // Create country material
  const countryMaterial = new THREE.MeshPhongMaterial({
    color: '0x00aaff',
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  })

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
      <BasicParticles />
      <GlobeEdges />
      <Stars radius={100} depth={50} count={1000} factor={12} fade />
      <FillCountries json={geoJson} radius={radius + 0.05} material={countryMaterial} />
      <OrbitControls enableDamping={true} zoomSpeed={0.2} dampingFactor={0.05} />
    </Canvas>
  )
}
