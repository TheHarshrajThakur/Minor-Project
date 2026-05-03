import { useState, useEffect, Suspense, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatedLogo } from '../3d/Models'
import { Home } from 'lucide-react'

const links = ['Home', 'Showcase', 'Inventory', 'Academy', 'About']

function NavLink({ link, isActive, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(link)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{
        fontSize: '0.7rem', fontWeight: 700,
        color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
        background: 'none', border: 'none', cursor: 'pointer',
        textTransform: 'uppercase', letterSpacing: '0.2em',
        position: 'relative',
        transition: 'color 0.3s ease',
        padding: '0.5rem 0.75rem',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{link}</span>
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          style={{
            position: 'absolute', bottom: '-4px', left: '50%', x: '-50%',
            width: '4px', height: '4px', borderRadius: '50%',
            background: '#3b82f6',
            boxShadow: '0 0 10px #3b82f6'
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

  // Subtle 3D Tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [5, -5]), { stiffness: 100, damping: 40 })
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), { stiffness: 100, damping: 40 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleMouseMove(e) {
    if (window.innerWidth < 1024) return
    const rect = navRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleNav = (link) => {
    const id = link.toLowerCase()
    setMobileOpen(false)
    if (id === 'home') {
      location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')
      return
    }
    if (id === 'academy') { navigate('/academy'); return }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed', top: '1.5rem', left: 0, right: 0, zIndex: 1000,
          perspective: '1000px', display: 'flex', justifyContent: 'center'
        }}
      >
        <motion.div 
          style={{
            rotateX, rotateY,
            width: 'fit-content', minWidth: 'min(90vw, 800px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.5rem 1rem 0.5rem 1.5rem',
            background: scrolled ? 'rgba(5, 5, 5, 0.7)' : 'rgba(5, 5, 5, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            transformStyle: 'preserve-3d',
            boxShadow: scrolled ? '0 20px 40px -15px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Minimalist Logo */}
          <div 
            onClick={() => handleNav('Home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', overflow: 'hidden', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={1}>
                <ambientLight intensity={1.5} />
                <Suspense fallback={null}>
                  <AnimatedLogo scale={1} />
                </Suspense>
              </Canvas>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>MECH</span>
              <span style={{ fontSize: '0.45rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1 }}>COMPANION</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="nav-links">
            {links.map((link) => (
              <NavLink 
                key={link} 
                link={link} 
                isActive={currentPathId === link.toLowerCase()} 
                onClick={handleNav} 
              />
            ))}
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.05, background: '#fff', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Get Started
            </motion.button>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ 
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', 
                padding: '0.5rem', marginLeft: '0.5rem', display: 'none'
              }}
              className="mobile-menu-btn"
            >
              <div style={{ width: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '1.5px', background: '#fff', width: mobileOpen ? '100%' : '60%' }} />
                <div style={{ height: '1.5px', background: '#fff', width: '100%' }} />
                <div style={{ height: '1.5px', background: '#fff', width: mobileOpen ? '100%' : '40%', alignSelf: 'flex-end' }} />
              </div>
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              position: 'fixed', top: '5rem', left: '1rem', right: '1rem', zIndex: 999,
              background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
              borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.08)',
              padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
              boxShadow: '0 40px 80px rgba(0,0,0,0.8)'
            }}
          >
            {links.map((link) => (
              <button 
                key={link} 
                onClick={() => handleNav(link)}
                style={{ 
                  color: '#fff', background: 'none', border: 'none',
                  textAlign: 'center', fontSize: '1.1rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  padding: '0.5rem 0', cursor: 'pointer'
                }}>
                {link}
              </button>
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
