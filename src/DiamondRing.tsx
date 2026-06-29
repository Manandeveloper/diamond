import { useMemo } from 'react'
import { useGLTF, MeshRefractionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

// Define the TS types for our specific GLTF structure
type GLTFResult = GLTF & {
  nodes: {
    Metal: THREE.Mesh
    Small_Diamonds: THREE.Mesh
    Big_Diamond: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

interface DiamondRingProps {
  envMap: THREE.Texture
  ior: number
  bounces: number
  aberrationStrength: number
  ringColor: string
}

export default function DiamondRing({
  envMap,
  ior,
  bounces,
  aberrationStrength,
  ringColor,
}: DiamondRingProps) {
  // Load the GLTF model
  const { nodes } = useGLTF('/models/diamond_ring.glb') as unknown as GLTFResult

  // Correct winding order and normals for the mirrored (left-side) diamonds
  const correctedGeometry = useMemo(() => {
    if (!nodes.Small_Diamonds) return null

    const geometry = nodes.Small_Diamonds.geometry.clone()
    const index = geometry.index
    const position = geometry.attributes.position

    if (index) {
      const indices = index.array.slice() // Clone index array to avoid mutating cached model geometry
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i]
        const x = position.getX(a)
        if (x < 0) {
          // Swap second and third indices of the triangle to flip winding order
          const temp = indices[i + 1]
          indices[i + 1] = indices[i + 2]
          indices[i + 2] = temp
        }
      }
      geometry.setIndex(new (THREE as any).BufferAttribute(indices, 1))
    } else if (position) {
      const posArray = position.array.slice() as Float32Array
      for (let i = 0; i < posArray.length; i += 9) {
        const x1 = posArray[i]
        if (x1 < 0) {
          // Swap second and third vertex coordinates to flip winding order for non-indexed geometry
          // x
          let temp = posArray[i + 3]
          posArray[i + 3] = posArray[i + 6]
          posArray[i + 6] = temp
          // y
          temp = posArray[i + 4]
          posArray[i + 4] = posArray[i + 7]
          posArray[i + 7] = temp
          // z
          temp = posArray[i + 5]
          posArray[i + 5] = posArray[i + 8]
          posArray[i + 8] = temp
        }
      }
      geometry.setAttribute('position', new (THREE as any).BufferAttribute(posArray, 3))
    }

    // Recompute vertex normals based on the corrected winding order
    geometry.computeVertexNormals()
    return geometry
  }, [nodes.Small_Diamonds])

  return (
    <group dispose={null}>
      {/* The Metal Ring Band */}
      {nodes.Metal && (
        <mesh
          geometry={nodes.Metal.geometry}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={ringColor}
            metalness={1.0}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={1.8}
            envMap={envMap}
          // visible={false}
          />
        </mesh>
      )}

      {/* Main Gemstone (Big Diamond) using Drei MeshRefractionMaterial */}
      {nodes.Big_Diamond && (
        <mesh
          geometry={nodes.Big_Diamond.geometry}
          castShadow
        >
          <MeshRefractionMaterial
            envMap={envMap}
            ior={ior}
            bounces={bounces}
            aberrationStrength={aberrationStrength}
            fresnel={1.0}
            fastChroma={true}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Side Gemstones (Small Diamonds) using Drei MeshRefractionMaterial */}
      {nodes.Small_Diamonds && correctedGeometry && (
        <mesh
          geometry={correctedGeometry}
          castShadow
        >
          <MeshRefractionMaterial
            envMap={envMap}
            ior={ior}
            bounces={bounces}
            aberrationStrength={aberrationStrength}
            fresnel={1.0}
            fastChroma={true}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/diamond_ring.glb')
