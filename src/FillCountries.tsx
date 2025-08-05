import { Line } from '@react-three/drei'
import * as THREE from 'three'

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export function FillCountries({ json, radius, material }: any) {
  if (!json) return null

  return (
    <>
      {json.features.map((feature: any, idx: number) => {
        const coords = feature.geometry.coordinates
        const polygons = feature.geometry.type === 'Polygon' ? [coords] : coords

        return polygons.map((polygon: any, i: number) => {
          // Triangulate the outer ring and holes in 2D
          const shape2D = new THREE.Shape(polygon[0].map(([lng, lat]: [number, number]) => new THREE.Vector2(lng, lat)))
          for (let h = 1; h < polygon.length; h++) {
            const hole = new THREE.Path(polygon[h].map(([lng, lat]: [number, number]) => new THREE.Vector2(lng, lat)))
            shape2D.holes.push(hole)
          }
          const flatGeometry = new THREE.ShapeGeometry(shape2D)

          // Project each vertex onto the sphere
          const pos = flatGeometry.attributes.position
          const sphericalPos: number[] = []
          for (let i = 0; i < pos.count; i++) {
            const lng = pos.getX(i)
            const lat = pos.getY(i)
            const v3 = latLngToVector3(lat, lng, radius)
            sphericalPos.push(v3.x, v3.y, v3.z)
          }
          const geometry3D = new THREE.BufferGeometry()
          geometry3D.setAttribute('position', new THREE.Float32BufferAttribute(sphericalPos, 3))
          geometry3D.setIndex(flatGeometry.index)
          geometry3D.computeVertexNormals()

          return (
            <group key={`${idx}-${i}`}>
              {/* Country fill */}
              <mesh geometry={geometry3D} material={material} />
              {/* Country borders */}
              {polygon.map((ring: any, j: number) => {
                const borderPoints = ring.map(([lng, lat]: [number, number]) =>
                  latLngToVector3(lat, lng, radius + 0.002),
                )
                borderPoints.push(borderPoints[0].clone())
                return <Line key={j} points={borderPoints} color="rgba(1, 105, 250, 1)" lineWidth={2} dashed={false} />
              })}
            </group>
          )
        })
      })}
    </>
  )
}
