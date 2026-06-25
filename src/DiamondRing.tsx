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
  fresnel: number
  fastChroma: boolean
  ringColor: string
}

export default function DiamondRing({
  envMap,
  ior,
  bounces,
  aberrationStrength,
  fresnel,
  fastChroma,
  ringColor,
}: DiamondRingProps) {
  // Load the GLTF model
  const { nodes } = useGLTF('/models/diamond_ring.glb') as unknown as GLTFResult

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
            fresnel={fresnel}
            fastChroma={fastChroma}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Side Gemstones (Small Diamonds) using Drei MeshRefractionMaterial */}
      {nodes.Small_Diamonds && (
        <mesh
          geometry={nodes.Small_Diamonds.geometry}
          castShadow
        >
          <MeshRefractionMaterial
            envMap={envMap}
            ior={ior}
            bounces={bounces}
            aberrationStrength={aberrationStrength}
            fresnel={fresnel}
            fastChroma={fastChroma}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/diamond_ring.glb')
