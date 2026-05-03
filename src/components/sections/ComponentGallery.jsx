import { Suspense, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, AdaptiveDpr } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { CrankshaftModel, PistonModel, SparkPlugModel, InternalsModel, EngineBlockModel } from '../3d/Models'
import { ArrowUpRight, Maximize2, Hand } from 'lucide-react'
import ErrorBoundary from '../utils/ErrorBoundary'
import { useNavigate } from 'react-router-dom'
import HandControls from '../utils/HandControls'
import HandGestureController from '../utils/HandGestureController'

export const COMPONENTS = [
  {
    id: 1, name: 'Forged Crankshaft', type: 'crankshaft', color: '#60a5fa', spec: 'Forged Steel',
    description: 'The engine shaft that converts pistons’ reciprocating motion into rotary motion. Forged from high-pressure steel billets, it offers superior strength, fatigue resistance, and grain flow alignment compared to cast alternatives.'
  },
  {
    id: 2, name: 'Performance Piston', type: 'piston', color: '#f87171', spec: 'Forged Alloy',
    description: 'High-compression forged piston designed to withstand extreme thermal and mechanical loads.'
  },
  {
    id: 3, name: 'Iridium Spark Plug', type: 'spark_plug', color: '#34d399', spec: '0.4mm Tip',
    description: 'High-performance iridium spark plug for optimal combustion efficiency and engine reliability.'
  },
  {
    id: 4, name: 'V8 Engine Internals', type: 'internals', color: '#f59e0b', spec: 'Complete Set',
    description: 'Fully assembled rotating assembly including crankshaft, rods, and pistons for a high-performance V8 engine.'
  },
  {
    id: 5, name: 'V8 Engine Block', type: 'engine', color: '#c084fc', spec: '6.2L V8',
    description: 'High-performance engine block with precision-cast cylinder banks and optimized cooling channels.'
  }
]

function ModelCard({ comp, onClick, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const controlsRef = useRef(null)
  const isInView = useInView(ref, { margin: "200px 0px" })
  const isHandTracking = useStore(state => state.isHandTracking)
  const setHandTracking = useStore(state => state.setHandTracking)
  
  const Model = comp.type === 'crankshaft' ? CrankshaftModel : 
                comp.type === 'piston' ? PistonModel : 
                comp.type === 'spark_plug' ? SparkPlugModel : 
                comp.type === 'engine' ? EngineBlockModel :
                InternalsModel

  const toggleFullscreen = (e) => {
    e.stopPropagation()
    const viewer = document.getElementById(`viewer-${comp.id}`);
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        scale: 1.03, 
        y: -10, 
        rotateX: 2, 
        rotateY: -2,
        boxShadow: '0 30px 60px -15px rgba(59,130,246,0.25)',
        borderColor: 'rgba(59,130,246,0.6)'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '1.25rem', overflow: 'hidden',
        background: 'rgba(20,20,20,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transformStyle: 'preserve-3d',
        height: '420px',
        boxShadow: '0 15px 35px -5px rgba(0,0,0,0.6), 0 0 15px rgba(59,130,246,0.05)'
      }}
    >
      <div id={`viewer-${comp.id}`} style={{ position: 'relative', height: '260px', background: '#f8f9fa' }}>
        {isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}` && <HandGestureController />}
        {isInView && (
          <ErrorBoundary>
          <Canvas
            dpr={[1, 1.2]}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <AdaptiveDpr pixelated />
            <Suspense fallback={null}>
              <Stage intensity={0.5} environment="city" adjustCamera={1.2} shadows={false}>
                <Model color={comp.color} />
              </Stage>
            </Suspense>
            <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
            <HandControls controlsRef={controlsRef} targetId={`comp-${comp.id}`} />
          </Canvas>
        </ErrorBoundary>
        )}

        {/* Type chip */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.25rem 0.6rem', borderRadius: '1rem',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: comp.color }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{comp.type}</span>
        </div>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: '32px', height: '32px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #e5e7eb', cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#374151',
            transition: 'all 0.2s'
          }}
          title="Fullscreen"
        >
          <Maximize2 size={14} />
        </button>

        {/* Hand Toggle */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            const isCurrentTarget = isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`;
            setHandTracking(!isCurrentTarget, `comp-${comp.id}`); 
          }}
          style={{
            position: 'absolute', top: '1rem', right: '3.5rem',
            width: '32px', height: '32px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? '1px solid #10b981' : '1px solid #e5e7eb',
            cursor: 'pointer', color: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? '#fff' : '#374151',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          title={(isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? "Disable Hand Control" : "Enable Hand Control"}
        >
          <Hand size={14} />
        </button>
      </div>

      {/* Info */}
      <div style={{
        padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'transparent',
        display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 800, color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '0.4rem'
            }}>
              {comp.name}
            </h3>
          </div>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease', color: '#fff'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#3b82f6' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            <ArrowUpRight size={14} color="currentColor" />
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade A1</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: comp.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{comp.spec}</span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * ComponentGallery Component
 * Renders a searchable and filterable grid of engineering components.
 * Each component is displayed in a ModelCard with 3D preview and gesture controls.
 */
export default function ComponentGallery() {
  const setActiveModel = useStore(state => state.setActiveModel)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Engine', 'Ignition', 'Drivetrain']

  const filteredComponents = COMPONENTS.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || 
                            (activeCategory === 'Engine' && (comp.type === 'engine' || comp.type === 'piston')) ||
                            (activeCategory === 'Ignition' && comp.type === 'spark_plug') ||
                            (activeCategory === 'Drivetrain' && (comp.type === 'crankshaft' || comp.type === 'internals'))
    return matchesSearch && matchesCategory
  })

  const handleCardClick = (comp) => {
    setActiveModel(comp)
    navigate(`/part/${comp.id}`)
  }

  return (
    <section id="inventory" style={{ padding: '8rem 1.5rem', background: '#050505', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header Area */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div className="section-label">
                <span>Technical Archive</span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: "'Outfit', sans-serif", lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                Component <span style={{ color: '#3b82f6' }}>Library</span>
              </motion.h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search components..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.85rem 1.5rem', borderRadius: '2rem',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                    width: '280px', fontSize: '0.9rem', outline: 'none',
                    color: '#fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.5rem', borderRadius: '2rem',
                  background: activeCategory === cat ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: activeCategory === cat ? '0 10px 20px -5px rgba(59,130,246,0.4)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div style={{ position: 'relative', minHeight: '400px' }}>
          {filteredComponents.length > 0 ? (
            <motion.div 
              layout
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '2.5rem' 
              }}
            >
              {filteredComponents.map((comp, i) => (
                <div key={comp.id} style={{ width: 'min(100%, 360px)' }}>
                  <ModelCard comp={comp} index={i} onClick={() => handleCardClick(comp)} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No components found</h3>
              <p>Try adjusting your search or category filters.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
