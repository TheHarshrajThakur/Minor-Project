import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring config for the trailing outer ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.4 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      // Check if hovering a clickable element
      const isClickable = 
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        window.getComputedStyle(e.target).cursor === 'pointer'

      setIsHovered(isClickable)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      <style>
        {`
          * {
            cursor: none !important;
          }
        `}
      </style>

      {/* Outer Trailing Glow Ring */}
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0,
          x: cursorXSpring, y: cursorYSpring,
          translateX: '-50%', translateY: '-50%',
          pointerEvents: 'none', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        animate={{
          width: isHovered ? 64 : 36,
          height: isHovered ? 64 : 36,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div 
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          animate={{
            border: isHovered ? '2px solid rgba(96,165,250,0.8)' : '1px solid rgba(59,130,246,0.6)',
            background: isHovered ? 'rgba(59,130,246,0.1)' : 'transparent',
            boxShadow: isHovered ? '0 0 20px rgba(59,130,246,0.6), inset 0 0 15px rgba(59,130,246,0.4)' : '0 0 10px rgba(59,130,246,0.2)',
            backdropFilter: isHovered ? 'blur(2px)' : 'none'
          }}
        />
        
        {/* Futuristic Crosshairs when hovered */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          style={{ position: 'absolute', width: '2px', height: '8px', background: '#60a5fa', top: '-4px', borderRadius: '2px' }}
        />
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          style={{ position: 'absolute', width: '2px', height: '8px', background: '#60a5fa', bottom: '-4px', borderRadius: '2px' }}
        />
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          style={{ position: 'absolute', width: '8px', height: '2px', background: '#60a5fa', left: '-4px', borderRadius: '2px' }}
        />
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          style={{ position: 'absolute', width: '8px', height: '2px', background: '#60a5fa', right: '-4px', borderRadius: '2px' }}
        />
      </motion.div>

      {/* Inner Exact Dot */}
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0,
          x: cursorX, y: cursorY,
          translateX: '-50%', translateY: '-50%',
          width: '6px', height: '6px',
          background: '#fff', borderRadius: '50%',
          boxShadow: '0 0 10px #fff, 0 0 20px #60a5fa',
          pointerEvents: 'none', zIndex: 10000
        }}
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0 : 1
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
