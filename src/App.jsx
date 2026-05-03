import React, { useEffect, Suspense } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import ModelViewer from './components/sections/ModelViewer'
import ComponentGallery from './components/sections/ComponentGallery'
import DetailPanel from './components/sections/DetailPanel'
import Academy from './components/sections/Academy'
import { AnimatedLogo } from './components/3d/Models'

import BackgroundGlow from './components/layout/BackgroundGlow'
import HandGestureController from './components/utils/HandGestureController'
import { useStore } from './store/useStore'

function HomePage() {
  const navigate = useNavigate()
  
  return (
    <>
      <Hero />
      <ModelViewer />
      <ComponentGallery />

      {/* Learn / Academy Section */}
      <section id="academy" style={{ padding: '8rem 1.5rem', background: 'transparent', position: 'relative' }}>
        <div className="bg-dot" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="section-label"
          >
            <span>Knowledge Base</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif", marginBottom: '4rem', perspective: '1000px' }}
          >
            Engineering <span className="text-gradient-blue">Academy</span>
          </motion.h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            {[
              { id: 'thermodynamics', title: 'Thermodynamics', desc: 'Governing principles of energy conversion, thermal efficiency, and the Carnot cycle limit in real-world power plants.', tag: 'Advanced' },
              { id: 'engine-cycles', title: 'IC Engine Cycles', desc: 'Deep dive into the Otto and Diesel thermodynamic cycles, volumetric efficiency, and combustion phase dynamics.', tag: 'Core Module' },
              { id: 'engine-anatomy', title: 'Engine Anatomy', desc: 'Precision metallurgy of the rotating assembly, valvetrain dynamics, and mitigation of high-RPM valve float.', tag: '12 Chapters' },
              { id: 'forced-induction', title: 'Forced Induction', desc: 'Turbocharger thermodynamics, adiabatic efficiency, and charge air cooling strategies for extreme power gains.', tag: 'Specialized' },
              { id: 'fluid-mechanics', title: 'Fluid Dynamics', desc: 'Hydrodynamic lubrication states, boundary layer behavior in intake runners, and high-G cavitation prevention.', tag: '8 Modules' },
              { id: 'materials', title: 'Material Science', desc: 'Crystalline grain structures in forged alloys, and the application of exotic superalloys like Inconel and Titanium.', tag: 'Metallurgy' },
            ].map((module, i) => (
              <motion.div
                key={module.title}
                onClick={() => navigate('/academy')}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10, 
                  rotateX: 5, 
                  rotateY: -5,
                  boxShadow: '0 25px 50px -12px rgba(59,130,246,0.3)',
                  borderColor: 'rgba(59,130,246,0.5)'
                }}
                className="glass-card card-hover"
                style={{ 
                  padding: '2.5rem', borderRadius: '1.5rem', cursor: 'pointer', transformStyle: 'preserve-3d',
                  width: 'min(100%, 360px)', height: '280px',
                  background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 15px 35px -5px rgba(0,0,0,0.8), 0 0 15px rgba(59,130,246,0.05)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    style={{
                      display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '0.5rem',
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                      fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6',
                      textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem',
                      alignSelf: 'flex-start'
                    }}
                  >
                    {module.tag}
                  </motion.div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                    {module.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {module.desc}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    EXPLORE MODULE <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '8rem 1.5rem', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="bg-grid" 
          style={{ position: 'absolute', inset: -1000, opacity: 0.15, transformOrigin: 'center' }} 
        />
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="section-label"
            >
              <span>Our Mission</span>
            </motion.div>
          </div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif", marginBottom: '2rem' }}
          >
            About <span className="text-gradient-blue">Mech Companion</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}
          >
            Mech Companion bridges the gap between theory and practice for mechanical engineers. Our interactive 3D platform allows students and professionals to explore, learn, and understand complex mechanical systems in unprecedented detail.
          </motion.p>
        </div>
      </section>
    </>
  )
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const isHandTracking = useStore(state => state.isHandTracking)

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { lenis.destroy(); cancelAnimationFrame(id) }
  }, [])

  return (
    <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', position: 'relative' }}>
      <BackgroundGlow />      
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)',
          transformOrigin: '0%', scaleX, zIndex: 999
        }}
      />

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/part/:id" element={<DetailPanel />} />
          <Route path="/academy" element={<Academy />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '6rem 1.5rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)',
        background: '#050505', position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            {/* Branding Column */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={1}>
                    <ambientLight intensity={1} />
                    <directionalLight position={[10, 10, 10]} intensity={2} />
                    <Suspense fallback={null}>
                      <AnimatedLogo />
                      <Environment preset="city" />
                    </Suspense>
                  </Canvas>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>MECH</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase', lineHeight: 1 }}>COMPANION</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '400px' }}>
                The world's most advanced interactive platform for mechanical engineering education. Visualizing the future of machines, one component at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: '360° Forge', id: 'showcase' },
                  { name: 'Technical Library', id: 'inventory' },
                  { name: 'Academy', path: '/academy' },
                  { name: 'Schematics', id: 'inventory' }
                ].map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => {
                        if (link.path) navigate(link.path)
                        else {
                          if (window.location.pathname !== '/') {
                            navigate('/')
                            setTimeout(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }), 100)
                          } else {
                            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                          }
                        }
                      }}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'Technical Docs', path: '/documentation' },
                  { name: 'Community', id: 'about' },
                  { name: 'System Status', id: 'showcase' },
                  { name: 'Changelog', id: 'inventory' }
                ].map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => {
                        if (link.path === '/documentation') {
                          // Open DOCUMENTATION.md in a new tab or navigate
                          window.open('https://github.com/mitwebsite/Minor-Website/blob/main/DOCUMENTATION.md', '_blank')
                        } else {
                          if (window.location.pathname !== '/') {
                            navigate('/')
                            setTimeout(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }), 100)
                          } else {
                            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                          }
                        }
                      }}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 500 }}>
              © 2026 MECH COMPANION. ALL SPECIFICATIONS SUBJECT TO INDUSTRIAL STANDARDS.
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
