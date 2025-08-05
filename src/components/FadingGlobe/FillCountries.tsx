import * as THREE from 'three'
import React, { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { Mesh } from 'three'

type GeoJSON = {
  features: {
    geometry: {
      type: 'Polygon' | 'MultiPolygon'
      coordinates: any[]
    }
  }[]
}

interface FillCountriesProps {
  json: GeoJSON | null
  radius: number
  material: THREE.Material
}

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function latLonArrayToVector2(latlonArray: [number, number][]): THREE.Vector2[] {
  return latlonArray.map(([lon, lat]) => new THREE.Vector2(lon, lat))
}

function polygonToMesh(
  rings: any[],
  radius: number,
  material: THREE.Material,
  key: string | number,
): JSX.Element | null {
  try {
    const shape = new THREE.Shape()

    const [outer, ...holes] = rings

    const outerPts = latLonArrayToVector2(outer)
    shape.setFromPoints(outerPts)

    holes.forEach((hole) => {
      const holePts = latLonArrayToVector2(hole)
      const path = new THREE.Path(holePts)
      shape.holes.push(path)
    })

    const geom2D = new THREE.ShapeGeometry(shape)
    geom2D.rotateX(Math.PI / 2)

    const pos = geom2D.getAttribute('position')
    const positions: number[] = []

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const vertex = latLonToVector3(y, x, radius)
      positions.push(vertex.x, vertex.y, vertex.z)
    }

    const globeGeom = new THREE.BufferGeometry()
    globeGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    globeGeom.computeVertexNormals()

    return <mesh key={key} geometry={globeGeom} material={material} />
  } catch (err) {
    console.warn('Failed to convert polygon to mesh:', err)
    return null
  }
}

export function FillCountries({ json, radius, material }: FillCountriesProps) {
  const meshes = useMemo(() => {
    if (!json) return []
    const features = json.features
    const meshes: JSX.Element[] = []

    features.forEach((feature, idx) => {
      const geometryType = feature.geometry.type
      const coords = feature.geometry.coordinates
      const polygons = geometryType === 'Polygon' ? [coords] : coords

      polygons.forEach((polygon, i) => {
        const mesh = polygonToMesh(polygon, radius, material, `${idx}-${i}`)
        if (mesh) meshes.push(mesh)
      })
    })

    return meshes
  }, [json, radius, material])

  return <group>{meshes}</group>
}
