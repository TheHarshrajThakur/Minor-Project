import { useState, useEffect, Suspense, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatedLogo } from '../3d/Models'

const links = ['Home', 'Showcase', 'Inventory', 'Academy', 'About']

function NavLink({ link, isActive, onClick, isScrolled }) {
  const textColor = isScrolled ? '#111' : (isActive ? '#fff' : 'rgba(255,255,255,0.5)')
  
  return (
    <motion.button
      onClick={() => onClick(link)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      style={{
        fontSize: '0.65rem', fontWeight: 800,
        color: textColor,
        background: 'none', border: 'none', cursor: 'pointer',
        textTransform: 'uppercase', letterSpacing: '0.25em',
        position: 'relative',
        transition: 'color 0.2s ease',
        padding: '0.5rem 0.8rem',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{link}</span>
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          style={{
            position: 'absolute', bottom: '-2px', left: '50%', x: '-50%',
            width: '3px', height: '3px', borderRadius: '50%',
            background: '#3b82f6',
            boxShadow: '0 0 8px #3b82f6'
          }}
        />
      )}
    </motion.button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef(null)

  // Minimal 3D Tilt for performance
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [3, -3]), { stiffness: 200, damping: 50 })
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-3, 3]), { stiffness: 200, damping: 50 })

  useEffect(() => {
    const handleScroll = () => { if (window.scrollY > 20) setScrolled(true); else setScrolled(false); }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleMouseMove(e) {
    if (window.innerWidth < 1200) return
    const rect = navRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleNav = (link) => {
    const id = link.toLowerCase()
    setMobileOpen(false)
    if (id === 'home') {
      location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'auto' }) : navigate('/')
      return
    }
    if (id === 'academy') { navigate('/academy'); return }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const currentPathId = location.pathname === '/academy' ? 'academy' : 
                        location.pathname === '/' ? 'home' : ''

  return (
    <>
      <motion.nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed', top: '1.25rem', left: 0, right: 0, zIndex: 2000,
          perspective: '1200px', display: 'flex', justifyContent: 'center'
        }}
      >
        <motion.div 
          style={{
            rotateX, rotateY,
            width: 'fit-content', minWidth: 'min(95vw, 900px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.4rem 0.8rem 0.4rem 1.25rem',
            background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            transformStyle: 'preserve-3d',
            boxShadow: scrolled ? '0 15px 35px -10px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* Logo */}
          <div 
            onClick={() => handleNav('Home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', overflow: 'hidden' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={1} gl={{ antialias: false }}>
                <ambientLight intensity={2} />
                <Suspense fallback={null}>
                  <AnimatedLogo scale={0.9} />
                </Suspense>
              </Canvas>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: scrolled ? '#000' : '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>MECH</span>
              <span style={{ fontSize: '0.4rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.25em', textTransform: 'uppercase', lineHeight: 1 }}>COMPANION</span>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="nav-links">
            {links.map((link) => (
              <NavLink 
                key={link} 
                link={link} 
                isActive={currentPathId === link.toLowerCase()} 
                onClick={handleNav}
                isScrolled={scrolled}
              />
            ))}
          </div>

          {/* Action */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.4rem 1.25rem', borderRadius: '100px',
                background: scrolled ? '#000' : 'rgba(255,255,255,0.1)',
                color: scrolled ? '#fff' : '#fff',
                border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Start
            </motion.button>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ 
                background: 'none', border: 'none', color: scrolled ? '#000' : '#fff', cursor: 'pointer', 
                padding: '0.5rem', marginLeft: '0.4rem', display: 'none'
              }}
              className="mobile-menu-btn"
            >
              <div style={{ width: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ height: '1.5px', background: 'currentColor', width: '100%' }} />
                <div style={{ height: '1.5px', background: 'currentColor', width: '100%' }} />
              </div>
            </button>
          </div>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{ 
              position: 'fixed', top: '4.5rem', left: '1rem', right: '1rem', zIndex: 3000,
              background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', 
              display: 'flex', flexDirection: 'column', gap: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            {links.map((link) => (
              <button key={link} onClick={() => handleNav(link)} style={{ color: '#000', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', padding: '0.5rem 0' }}>{link}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 850px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}
