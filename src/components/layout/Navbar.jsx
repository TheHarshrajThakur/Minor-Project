import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatedLogo } from '../3d/Models'
import { Home } from 'lucide-react'

const links = ['Home', 'Showcase', 'Inventory', 'Academy', 'About']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (link) => {
    const id = link.toLowerCase()
    setMobileOpen(false)

    if (id === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }

    if (id === 'academy') {
      navigate('/academy')
      return
    }

    // Hash navigation for sections on home page
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0, rotateX: -30 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '1rem 1.5rem',
          perspective: '1000px'
        }}
      >
        <motion.div 
          animate={{
            boxShadow: scrolled ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.2)',
            background: scrolled ? 'rgba(5,5,5,0.85)' : 'rgba(5,5,5,0.4)',
            borderColor: scrolled ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'
          }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: '1400px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.6rem 1.5rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid',
            borderRadius: '1.25rem',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Logo with 3D Canvas */}
          <motion.div 
            onClick={() => handleNav('Home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                <Suspense fallback={null}>
                  <AnimatedLogo />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>MECH</div>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase', lineHeight: 1 }}>COMPANION</div>
            </div>
          </motion.div>

          {/* Desktop Links with 3D Hover */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', transformStyle: 'preserve-3d' }} className="nav-links">
            {links.map((link, i) => (
              <motion.button 
                key={link} 
                onClick={() => handleNav(link)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.15, 
                  y: -2,
                  color: '#fff',
                  textShadow: '0px 4px 12px rgba(59,130,246,0.6)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                {link === 'Home' && <Home size={12} />}
                {link}
              </motion.button>
            ))}
          </div>

          {/* CTA with 3D Pop */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 20px rgba(59,130,246,0.5)',
                y: -2
              }}
              whileTap={{ scale: 0.95, y: 0 }}
              className="btn-primary" 
              style={{ padding: '0.7rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}
            >
              Get Started
            </motion.button>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem',
                display: 'none'
              }}
              className="mobile-menu-btn"
            >
              <div style={{ width: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    animate={mobileOpen ? { 
                      rotate: i === 1 ? 0 : (i === 0 ? 45 : -45),
                      y: i === 1 ? 0 : (i === 0 ? 6 : -6),
                      opacity: i === 1 ? 0 : 1
                    } : { rotate: 0, y: 0, opacity: 1 }}
                    style={{ height: '2px', background: '#fff', borderRadius: '1px', transformOrigin: 'center' }} 
                  />
                ))}
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, rotateX: -20, y: -20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -20, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              position: 'fixed', top: '6rem', left: '1rem', right: '1rem', zIndex: 99,
              background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)',
              borderRadius: '1rem', border: '1px solid rgba(59,130,246,0.3)',
              padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              transformOrigin: 'top'
            }}
          >
            {links.map((link, i) => (
              <motion.button 
                key={link} 
                onClick={() => handleNav(link)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                style={{ 
                  color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left',
                  fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', 
                  letterSpacing: '0.1em', padding: '0.75rem 0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                {link === 'Home' && <Home size={18} />}
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  )
}
