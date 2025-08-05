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
          const ringsLatLng = polygon.map((ring: any) => ring.map(([lng, lat]: [number, number]) => ({ lat, lng })))

          if (ringsLatLng.length === 0 || ringsLatLng[0].length < 3) return null

          // Convert outer ring to flat 2D shape using lng/lat as x/y
          const shape2D = new THREE.Shape(ringsLatLng[0].map(({ lng, lat }: any) => new THREE.Vector2(lng, lat)))

          // Add holes
          for (let h = 1; h < ringsLatLng.length; h++) {
            const hole = new THREE.Path(ringsLatLng[h].map(({ lng, lat }: any) => new THREE.Vector2(lng, lat)))
            shape2D.holes.push(hole)
          }

          // Create flat geometry
          const flatGeometry = new THREE.ShapeGeometry(shape2D)

          // Project vertices to sphere
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
          geometry3D.computeVertexNormals()

          return (
            <group key={`${idx}-${i}`}>
              <mesh geometry={geometry3D} material={material} />
              {/* Country borders */}
              {ringsLatLng.map((ring: any, j: number) => {
                const borderPoints = ring.map(
                  ({ lat, lng }: any) => latLngToVector3(lat, lng, radius + 0.002), // tiny offset so it sits above the fill
                )
                borderPoints.push(borderPoints[0].clone())

                return (
                  <Line
                    key={j}
                    points={borderPoints} // array of THREE.Vector3
                    color="green"
                    lineWidth={2} // pixels on screen – make this as bold as you like
                    dashed={false}
                  />
                )
              })}
            </group>
          )
        })
      })}
    </>
  )
}
