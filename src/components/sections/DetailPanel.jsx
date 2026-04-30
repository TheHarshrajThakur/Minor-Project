import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Settings, ShieldCheck, Cpu, Hand, Maximize2 } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { useParams, useNavigate } from 'react-router-dom'
import { CrankshaftModel, PistonModel, SparkPlugModel, InternalsModel, EngineBlockModel } from '../3d/Models'
import ErrorBoundary from '../utils/ErrorBoundary'
import { COMPONENTS } from './ComponentGallery'
import HandControls from '../utils/HandControls'
import HandGestureController from '../utils/HandGestureController'
import { useStore } from '../../store/useStore'
import { useRef } from 'react'

function DetailModel({ type, color }) {
  const controlsRef = useRef(null)
  const Model = type === 'crankshaft' ? CrankshaftModel : 
                type === 'piston' ? PistonModel : 
                type === 'spark_plug' ? SparkPlugModel : 
                type === 'engine' ? EngineBlockModel :
                InternalsModel
  
  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={1.2} shadows={false}>
            <Model color={color} />
          </Stage>
        </Suspense>
        <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
        <HandControls controlsRef={controlsRef} targetId={`detail-${id}`} />
      </Canvas>
    </ErrorBoundary>
  )
}

/**
 * DetailPanel Component
 * Renders the full specification page for a selected component.
 * Includes a large-scale 3D viewer, technical data tables, and CAD download options.
 */
export default function DetailPanel() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const activeModel = COMPONENTS.find(c => c.id === parseInt(id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!activeModel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '1rem' }}>Component Not Found</h2>
          <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const specs = [
    { icon: Cpu, label: 'Material', value: 'Titanium Alloy' },
    { icon: ShieldCheck, label: 'Tolerance', value: '±0.001mm' },
    { icon: Settings, label: 'Grade', value: 'Industrial A1' },
  ]

  const handleDownload = () => {
    const content = `[CAD Schematic Data for ${activeModel.name}]\nReference ID: MC-2026-X0${activeModel.id}\nMaterial: ${activeModel.spec}\nType: ${activeModel.type}\n\n*This is a generated placeholder CAD file for demonstration.*`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeModel.type.toLowerCase()}_schematic.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Mech Companion: ${activeModel.name}`,
      text: `Check out the ${activeModel.name} 3D model and technical specs on Mech Companion!`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column: 3D Viewer */}
          <motion.div
            id={`viewer-detail-${activeModel.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              height: '70vh', minHeight: '500px',
              background: '#f8f9fa', borderRadius: '1.5rem',
              border: '1px solid #e5e7eb', overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 20px rgba(59,130,246,0.1)'
            }}
          >
            {/* Controls Overlay */}
            <div style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              zIndex: 10, display: 'flex', gap: '12px'
            }}>
              <button
                onClick={() => {
                  const targetId = `detail-${activeModel.id}`;
                  const currentlyActive = useStore.getState().isHandTracking && useStore.getState().handControlTarget === targetId;
                  useStore.getState().setHandTracking(!currentlyActive, targetId);
                }}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: (useStore(state => state.isHandTracking) && useStore(state => state.handControlTarget) === `detail-${activeModel.id}`) ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  border: (useStore(state => state.isHandTracking) && useStore(state => state.handControlTarget) === `detail-${activeModel.id}`) ? '1px solid #10b981' : '1px solid #e5e7eb',
                  cursor: 'pointer', color: (useStore(state => state.isHandTracking) && useStore(state => state.handControlTarget) === `detail-${activeModel.id}`) ? '#fff' : '#374151',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                }}
                title={(useStore(state => state.isHandTracking) && useStore(state => state.handControlTarget) === `detail-${activeModel.id}`) ? "Disable Hand Control" : "Enable Hand Control"}
              >
                <Hand size={18} />
              </button>
              <button
                onClick={() => {
                  const viewer = document.getElementById(`viewer-detail-${activeModel.id}`);
                  if (!document.fullscreenElement) {
                    viewer.requestFullscreen().catch(err => console.log(err));
                  } else {
                    document.exitFullscreen();
                  }
                }}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb',
                  cursor: 'pointer', color: '#374151',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                }}
                title="Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <DetailModel type={activeModel.type} color={activeModel.color} />
            {useStore(state => state.isHandTracking) && useStore(state => state.handControlTarget) === `detail-${activeModel.id}` && (
              <>
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.9)', padding: '8px 12px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', pointerEvents: 'none' }}>
                  <Hand size={16} color="#10b981" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Hand Control Active</span>
                </div>
                <HandGestureController />
              </>
            )}
          </motion.div>

          {/* Right Column: Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 0.75rem', borderRadius: '1rem',
                background: '#eff6ff', color: '#2563eb',
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '1rem'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                {activeModel.type}
              </div>
              
              <h1 style={{
                fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800,
                color: '#ffffff', fontFamily: "'Inter', sans-serif",
                lineHeight: 1.1, marginBottom: '0.5rem'
              }}>
                {activeModel.name}
              </h1>
              
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Serial: MC-2026-X0{activeModel.id}
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1.1rem' }}>
              {activeModel.description} Engineered for high-stress industrial applications requiring extreme precision and durability.
            </p>

            {/* Technical Specification Table */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', 
              overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' 
            }}>
              <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={18} color="#3b82f6" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', letterSpacing: '-0.01em' }}>Technical Specifications</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {[
                  { label: 'Reference ID', value: `MC-2026-X0${activeModel.id}` },
                  { label: 'Net Weight', value: '3.85 kg' },
                  { label: 'Core Material', value: 'Titanium-G5' },
                  { label: 'Hardness', value: '45 HRC' },
                  { label: 'Thermal Range', value: '-60°C to 450°C' },
                  { label: 'Certification', value: 'ISO-9001 Pro' },
                ].map((spec, i) => (
                  <div key={spec.label} style={{ 
                    padding: '1.25rem 1.5rem', 
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{spec.label}</div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <motion.button 
                onClick={handleDownload}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  flex: 1, padding: '1.25rem', borderRadius: '1rem', background: '#111827', 
                  color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.95rem', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)'
                }}
              >
                <Download size={20} />
                Download CAD Schematic
              </motion.button>
              <motion.button 
                onClick={handleShare}
                whileHover={{ scale: 1.02, y: -2, background: '#f3f4f6' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  padding: '1.25rem 2rem', borderRadius: '1rem', background: '#fff', 
                  border: '1px solid #e5e7eb', color: '#111827', fontWeight: 800, 
                  cursor: 'pointer', fontSize: '0.95rem'
                }}
              >
                Share Data
              </motion.button>
            </div>

            {/* Quality Badge */}
            <div style={{ 
              padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(59,130,246,0.04)', 
              border: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: '1.25rem',
              alignItems: 'center'
            }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                <ShieldCheck size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>A1 Engineering Grade</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  Validated for high-stress aerospace and automotive applications.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
