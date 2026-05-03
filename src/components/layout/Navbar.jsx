import { useState, useEffect, Suspense, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatedLogo } from '../3d/Models'
import { Home, Sparkles } from 'lucide-react'

const links = ['Home', 'Showcase', 'Inventory', 'Academy', 'About']

function NavLink({ link, isActive, onClick, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.4)
    y.set((e.clientY - centerY) * 0.4)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      onClick={() => onClick(link)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseX,
        y: mouseY,
        fontSize: '0.75rem', fontWeight: 800,
        color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
        background: 'none', border: 'none', cursor: 'pointer',
        textTransform: 'uppercase', letterSpacing: '0.15em',
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        position: 'relative',
        transition: 'color 0.3s ease',
        zIndex: 2,
        padding: '0.5rem 1rem'
      }}
    >
      {link === 'Home' && <Home size={12} />}
      {link}
      {isActive && (
        <motion.div
          layoutId="active-nav-bg"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.75rem',
            zIndex: -1,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
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

  // 3D Tilt Logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleMouseMove(e) {
    if (window.innerWidth < 768) return
    const rect = navRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

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

  const currentPathId = location.pathname === '/academy' ? 'academy' : 
                        location.pathname === '/' ? 'home' : ''

  return (
    <>
      <motion.nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '1.5rem',
          perspective: '1200px'
        }}
      >
        <motion.div 
          style={{
            rotateX, rotateY,
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 2rem',
            background: scrolled ? 'rgba(5, 5, 10, 0.8)' : 'rgba(10, 10, 15, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.5rem',
            transformStyle: 'preserve-3d',
            boxShadow: scrolled ? '0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)' : '0 15px 35px -10px rgba(0,0,0,0.3)',
            transition: 'background 0.4s ease'
          }}
        >
          {/* 3D Logo Section */}
          <motion.div 
            onClick={() => handleNav('Home')}
            whileHover={{ scale: 1.05, translateZ: 20 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transformStyle: 'preserve-3d' }}
          >
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(59,130,246,0.4)', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={1}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                <Suspense fallback={null}>
                  <AnimatedLogo scale={1.1} />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>
            <div style={{ transform: 'translateZ(10px)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>MECH</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.25em', color: '#3b82f6', textTransform: 'uppercase', lineHeight: 1.2 }}>COMPANION</div>
            </div>
          </motion.div>

          {/* Magnetic Nav Links */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', transformStyle: 'preserve-3d' }} className="nav-links">
            {links.map((link) => (
              <NavLink 
                key={link} 
                link={link} 
                isActive={currentPathId === link.toLowerCase()} 
                onClick={handleNav} 
              />
            ))}
          </div>

          {/* Action Area */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', transformStyle: 'preserve-3d' }}>
            <motion.button 
              whileHover={{ 
                scale: 1.05, translateZ: 30,
                boxShadow: '0 15px 30px rgba(59,130,246,0.5)',
                background: '#4f46e5'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.8rem 1.75rem', borderRadius: '1rem',
                background: '#3b82f6', color: '#fff', border: 'none',
                fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: '0 10px 20px rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Sparkles size={14} />
              Get Started
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', cursor: 'pointer', padding: '0.6rem', borderRadius: '0.75rem',
                display: 'none'
              }}
              className="mobile-menu-btn"
            >
              <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    animate={mobileOpen ? { 
                      rotate: i === 1 ? 0 : (i === 0 ? 45 : -45),
                      y: i === 1 ? 0 : (i === 0 ? 7 : -7),
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              style={{
                position: 'absolute', top: '7rem', left: '1.5rem', right: '1.5rem',
                background: 'rgba(15,15,20,0.95)', borderRadius: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)', padding: '2rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {links.map((link) => (
                <button 
                  key={link} 
                  onClick={() => handleNav(link)}
                  style={{ 
                    color: '#fff', background: 'none', border: 'none',
                    textAlign: 'left', fontSize: '1.25rem', fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '0.5rem 0', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '1rem'
                  }}>
                  {link}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .nav-links { gap: 0.5rem !important; }
        }
        @media (max-width: 800px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
