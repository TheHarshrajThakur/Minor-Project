# Mech Companion | Full Project Documentation

> **Status**: v1.0.0 (May 3, 2026)  
> **Topic**: Interactive 3D Mechanical Engineering Education Platform  

---

## 1. Project Purpose & Vision
**Mech Companion** is a next-generation educational tool designed to bridge the gap between abstract mechanical engineering theories and physical intuition. By leveraging high-fidelity 3D visualization and touchless gesture control, the platform provides an immersive learning environment that is both technically rigorous and highly engaging.

### Core Objectives:
- **Visualize Complexity**: Break down complex mechanical assemblies (engines, valvetrains, crankshafts) into inspectable 3D components.
- **Interactive Learning**: Move beyond static diagrams to interactive models that users can manipulate and explore.
- **Gesture-Driven Innovation**: Implement "Touchless UI" using computer vision to allow engineers to interact with models while keeping their hands free for physical work or note-taking.
- **Knowledge Consolidation**: Centralize technical specifications, thermodynamic laws, and material science in a searchable "Engineering Academy."

---

## 2. Key Features

### 🧊 360° Interactive 3D Showcase
The heart of the platform is the **Model Viewer**, which supports:
- **Native 3D Rendering**: High-performance rendering of GLTF/GLB models using Three.js.
- **Exploded Views & Cross-Sections**: Inspecting the internals of an engine block.
- **System Architecture Mapping**: An interactive "Mind Map" that overlays technical logic (ECU, Lubrication, Thermal Management) onto the physical model.

### 🖐️ Hand Gesture Control System
Integrating **Google MediaPipe** for a futuristic interaction layer:
- **Rotation**: Rotate models by moving your palm in 3D space.
- **Zoom**: Pinch-to-zoom functionality detected via webcam.
- **Snappy Response**: Low-latency interpolation ensures the 3D camera follows hand movements naturally.

### 🎓 Engineering Academy
A structured knowledge hub containing:
- **Thematic Modules**: Thermodynamics, IC Engine Cycles, Engine Anatomy, Forced Induction, Fluid Dynamics, and Material Science.
- **Mathematical Rigor**: Inclusion of key formulas (e.g., Carnot Efficiency, Ideal Gas Law, First Law of Thermo).
- **Searchable Database**: Quickly find specific modules or technical definitions.

### 📋 Component Inventory & CAD Integration
- **Technical Specifications**: Detailed data for every component, including Material, Tolerance, and Thermal Range.
- **CAD Downloads**: Ability to download schematic data placeholders for industrial reference.

---

## 3. Technical Architecture

### Tech Stack
- **Frontend Framework**: [React 19](https://react.dev/) (Vite)
- **3D Engine**: [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) & [Drei](https://github.com/pmndrs/drei)
- **Computer Vision**: [MediaPipe](https://google.github.io/mediapipe/) (Hand Landmarker)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS for premium micro-interactions.
- **Icons**: [Lucide React](https://lucide.dev/)

### System Architecture
1.  **State Layer (`useStore.js`)**: Manages active models, hand tracking status, and global UI states.
2.  **Logic Layer (`HandGestureController.jsx`, `HandControls.jsx`)**: Processes raw webcam data and converts it into 3D coordinate transforms.
3.  **UI Layer**: Responsive layouts built with glassmorphic aesthetics and high-contrast typography.

---

## 4. Presentation Outline (Slide Deck)

Use this structure for pitching or presenting the project:

| Slide # | Title | Content Focus |
| :--- | :--- | :--- |
| **01** | **Mech Companion** | Project name, tagline ("Industrial-Grade Education"), and stunning engine render. |
| **02** | **The Problem** | Disconnect between 2D textbooks and 3D physical reality. Complexity of modern machinery. |
| **03** | **The Solution** | Interactive 3D visualization paired with AI-driven gesture controls. |
| **04** | **3D Showcase** | Demo the engine model. Mention the System Architecture Mind Map. |
| **05** | **Hand Gesture UI** | "The Future of Interaction." Demo rotating the model without a mouse/touchpad. |
| **06** | **Engineering Academy** | Show the library of technical modules and formulas. |
| **07** | **Tech Stack** | React, Three.js, MediaPipe, Zustand. Emphasize performance and scalability. |
| **08** | **Future Roadmap** | AR/VR support, Real-time telemetry integration, Multiplayer collaboration. |
| **09** | **Conclusion** | Vision for the future of technical education. Q&A. |

---

## 5. Maintenance & Updates
To keep this documentation updated as the project grows:
1.  **Code Changes**: If a new component is added to `src/components/3d`, update the **Key Features** section.
2.  **Dependencies**: If you install new core packages, update the **Technical Architecture** section.
3.  **Presentation**: Adjust the **Slide Deck** whenever a major new "WOW" feature (like VR) is implemented.

---
*© 2026 Mech Companion. All Rights Reserved.*
