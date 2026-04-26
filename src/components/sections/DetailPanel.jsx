import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Settings, ShieldCheck, Cpu } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { useParams, useNavigate } from 'react-router-dom'
import { CrankshaftModel, PistonModel, SparkPlugModel, InternalsModel, EngineBlockModel } from '../3d/Models'
import ErrorBoundary from '../utils/ErrorBoundary'
import { COMPONENTS } from './ComponentGallery'

function DetailModel({ type, color }) {
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
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </ErrorBoundary>
  )
}

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

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              background: '#f3f4f6', border: '1px solid #e5e7eb',
              color: '#374151', cursor: 'pointer', fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6' }}
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column: 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              height: '70vh', minHeight: '500px',
              background: '#f8f9fa', borderRadius: '1.5rem',
              border: '1px solid #e5e7eb', overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 20px rgba(59,130,246,0.1)'
            }}
          >
            <DetailModel type={activeModel.type} color={activeModel.color} />
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
                color: '#111827', fontFamily: "'Inter', sans-serif",
                lineHeight: 1.1, marginBottom: '0.5rem'
              }}>
                {activeModel.name}
              </h1>
              
              <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Serial: MC-2026-X0{activeModel.id}
              </div>
            </div>

            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.1rem' }}>
              {activeModel.description} Engineered for high-stress industrial applications requiring extreme precision and durability.
            </p>

            {/* Technical Specification Table */}
            <div style={{ 
              background: '#f9fafb', borderRadius: '1.25rem', border: '1px solid #e5e7eb', 
              overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
            }}>
              <div style={{ padding: '1.25rem 1.5rem', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={18} color="#3b82f6" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', letterSpacing: '-0.01em' }}>Technical Specifications</span>
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
                    borderBottom: i < 4 ? '1px solid #e5e7eb' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid #e5e7eb' : 'none',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ color: '#6b7280', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{spec.label}</div>
                    <div style={{ color: '#111827', fontWeight: 800 }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <motion.button 
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
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(59,130,246,0.1)' }}>
                <ShieldCheck size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>A1 Engineering Grade</div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
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
