import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { MainEngine } from '../3d/Models'
import { Maximize2, Zap, Layers, RefreshCcw } from 'lucide-react'
import ErrorBoundary from '../utils/ErrorBoundary'
import { useStore } from '../../store/useStore'

function EngineScene({ isAnimated }) {
  return (
    <ErrorBoundary>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%', background: '#f8f9fa' }}
      >
        <color attach="background" args={['#ffffff']} />
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={true} shadows={false}>
            <MainEngine animated={isAnimated} />
          </Stage>
        </Suspense>
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          makeDefault 
          autoRotate={isAnimated}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </ErrorBoundary>
  )
}

export default function ModelViewer() {
  const [source, setSource] = useState('native')
  const [isAnimated, setIsAnimated] = useState(true)

  const REF_URL =
    'https://sketchfab.com/models/eea9d9252ab14298b50699a471dc2cee/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&preload=1&transparent=1&dnt=1'

  const toggleFullscreen = () => {
    const viewer = document.getElementById('engine-viewer');
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <section
      id="showcase"
      style={{ padding: '4rem 1.5rem', background: '#ffffff', position: 'relative' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem', fontWeight: 700, color: '#111827',
            fontFamily: "'Inter', sans-serif", marginBottom: '0.5rem'
          }}>
            360° Interactive Engine Model
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Click and drag to rotate the model. Scroll to zoom in and out.
          </p>
        </div>

        {/* Main Viewer Box */}
        <motion.div
          id="engine-viewer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            height: '600px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 20px rgba(59,130,246,0.1)'
          }}
        >
          {/* 360 Indicator */}
          <div style={{
            position: 'absolute', top: '20px', left: '20px',
            zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)', padding: '8px 12px',
            borderRadius: '20px', border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            pointerEvents: 'none'
          }}>
            <RefreshCcw size={16} color="#374151" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>360° View</span>
          </div>

          {/* Controls Overlay */}
          <div style={{
            position: 'absolute', bottom: '20px', right: '20px',
            zIndex: 10, display: 'flex', gap: '10px'
          }}>
            {source === 'native' && (
              <button
                onClick={() => setIsAnimated(!isAnimated)}
                title={isAnimated ? "Pause Auto-Rotate" : "Start Auto-Rotate"}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: isAnimated ? '#2563eb' : '#6b7280',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                }}
              >
                <Zap size={18} />
              </button>
            )}
            
            <button
              onClick={() => setSource(source === 'native' ? 'reference' : 'native')}
              title={source === 'native' ? "View Reference Model" : "View Native Model"}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#374151',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
              }}
            >
              <Layers size={18} />
            </button>

            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#374151',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
              }}
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* 3D Scene / Iframe */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            {source === 'native' ? (
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
                  Loading Model...
                </div>
              }>
                <EngineScene isAnimated={isAnimated} />
              </Suspense>
            ) : (
              <iframe
                title="Internal Engineering Reference"
                src={REF_URL}
                frameBorder="0"
                allowFullScreen
                allow="autostart; autoplay; fullscreen; xr-spatial-tracking"
                style={{
                  width: '100%', height: '100%',
                  border: 'none', background: '#ffffff'
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

