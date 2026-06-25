# R3F Interactive Diamond Ring Viewer

A minimalist, high-end, interactive React web application built with **React Three Fiber (R3F)**, **React Three Drei**, and **TypeScript** to visualize a photorealistic 3D diamond ring.

This configurator leverages Drei's advanced `<MeshRefractionMaterial />` to simulate complex gemstone physics, including index of refraction (IOR), ray bounces, chromatic aberration (rainbow dispersion effect), and internal reflection.

## Project Features

*   **Photorealistic Gemstone Refraction**: Uses `<MeshRefractionMaterial />` alongside `three-mesh-bvh` for real-time ray-casted internal refractions and light dispersion.
*   **Physically-Based Metal Band**: Features a custom `<meshPhysicalMaterial>` band shader supporting Gold, Rose Gold, and Platinum presets via a dynamic color picker.
*   **Dual Environment Maps**: Switchable lighting environments using high-dynamic-range imaging:
    *   **Studio Lighting (EXR)**: A soft, white-walled indoor photography environment.
    *   **Exterior Sunset (HDR)**: A sunset environment adding warm, colorful dispersion and highlights.
*   **Grounding Shadows**: High-resolution `<ContactShadows />` to anchor the jewelry model realistically.
*   **Premium Glassmorphic UI**: Integrates a sleek, modern glassmorphic control sidebar overlaying the 3D scene, which embeds **Leva** controls.
*   **Responsive Layout**: Dynamically handles layout changes for mobile and desktop screens.

---

## Technical Stack & Libraries

*   **Vite**: Frontend build tool.
*   **React & TypeScript**: App logic and structure.
*   **Three.js**: WebGL 3D library.
*   **@react-three/fiber**: React renderer for Three.js.
*   **@react-three/drei**: Helper components for React Three Fiber (including `<MeshRefractionMaterial />`, `<Environment />`, `<ContactShadows />`, `<Center />`, `<OrbitControls />`).
*   **Leva**: Dynamic UI control interface.
*   **three-mesh-bvh**: High-speed spatial index for rapid ray-casting in Three.js (used for internal reflections).

---

## Asset Setup

The project structure expects the following asset layout in `/public`:

```text
/public
├── /models
│   └── diamond_ring.glb       # The 3D model containing 'Metal', 'Small_Diamonds', and 'Big_Diamond' meshes
└── /hdri
    ├── white_home_studio_4k.exr  # Studio lighting EXR
    └── venice_sunset_1k.hdr      # Sunset exterior HDR (download instructions below)
```

### Download Venice Sunset HDRI Map
Due to sandbox constraints, please run the following command in your terminal to fetch the exterior environment map:

```bash
curl -L -o public/hdri/venice_sunset_1k.hdr https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr
```

---

## Getting Started

### 1. Install Dependencies
Ensure you have Node.js installed, then install the dependencies using:

```bash
npm install
```

### 2. Start the Development Server
Run the local Vite server:

```bash
npm run dev
```

### 3. Open in Browser
Open the local URL output by Vite (usually `http://localhost:5173`) in your browser to interact with the model.

---

## Interactive Controls Description

### Diamond Settings
*   **Refractive Index (IOR)**: Bends the light as it passes through the diamond (Real diamond value is `2.417`).
*   **Reflections (Bounces)**: Sets the maximum internal reflection rays inside the diamond (values `1` to `8`).
*   **Dispersion (Rainbow)**: Determines the chromatic aberration intensity (strength of color separation/rainbow effect).
*   **Fresnel Bias**: Controls the strength of surface highlights at glancing angles.
*   **Fast Chroma Mode**: Optimizes ray calculations to maintain performance.

### Scene Settings
*   **Environment Map**: Switch between indoor **Studio** lighting and outdoor **Sunset** lighting.
*   **Band Color**: Custom color picker to choose Gold, Platinum, Rose Gold, or other metallic colors.
*   **Orbit Auto-Rotate**: Enables slow, continuous rotation of the camera around the ring.
