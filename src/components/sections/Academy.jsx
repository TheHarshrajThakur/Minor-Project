import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Droplets, Flame, Cog, Activity, Zap, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACADEMY_DATA = [
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    icon: Flame,
    color: '#ef4444',
    content: (
      <div className="study-content">
        <h3>1. Introduction to Thermodynamics</h3>
        <p>Thermodynamics is the branch of physics that deals with the relationships between heat and other forms of energy. In mechanical engineering, it forms the foundation for understanding engines, power plants, and HVAC systems.</p>
        
        <h3>2. The Laws of Thermodynamics</h3>
        <ul>
          <li><strong>Zeroth Law:</strong> Thermal equilibrium foundation. If A=C and B=C, then A=B.</li>
          <li><strong>First Law:</strong> Conservation of energy. ΔU = Q - W. Energy in = Energy out + Change in internal energy.</li>
          <li><strong>Second Law:</strong> Entropy always increases. Heat cannot be 100% converted to work.</li>
          <li><strong>Third Law:</strong> Entropy approaches a constant value as temperature approaches absolute zero.</li>
        </ul>

        <h3>3. Real-world Application: Heat Engines</h3>
        <p>A heat engine is a system that converts heat or thermal energy to mechanical energy, which can then be used to do mechanical work. It does this by bringing a working substance from a higher state temperature to a lower state temperature.</p>
      </div>
    )
  },
  {
    id: 'engine-cycles',
    title: 'IC Engine Cycles',
    icon: Activity,
    color: '#f97316',
    content: (
      <div className="study-content">
        <h3>1. The 4-Stroke Cycle (Otto Cycle)</h3>
        <p>The majority of modern automotive engines operate on the four-stroke principle, patented by Nicolaus Otto in 1876.</p>
        <ul>
          <li><strong>Intake:</strong> Piston moves down, intake valve opens, air-fuel mixture is drawn in.</li>
          <li><strong>Compression:</strong> Valves close, piston moves up, compressing the mixture and raising its temperature.</li>
          <li><strong>Power (Combustion):</strong> Spark plug fires, mixture ignites, rapid expansion forces the piston down.</li>
          <li><strong>Exhaust:</strong> Exhaust valve opens, piston moves up, pushing out burnt gases.</li>
        </ul>
        
        <h3>2. Diesel vs. Petrol (Gasoline)</h3>
        <p>While Petrol engines use a spark plug for ignition, Diesel engines use <strong>Compression Ignition</strong>. Air is compressed to such a high ratio that the resulting heat causes the fuel to ignite spontaneously upon injection.</p>
        
        <h3>3. Efficiency Factors</h3>
        <p>Engine efficiency is limited by the compression ratio. Higher ratios generally yield better efficiency but increase the risk of "knocking" or pre-ignition in petrol engines.</p>
      </div>
    )
  },
  {
    id: 'engine-components',
    title: 'Engine Anatomy',
    icon: Cog,
    color: '#8b5cf6',
    content: (
      <div className="study-content">
        <h3>1. The Piston & Connecting Rod</h3>
        <p>The piston is the "heart" of the combustion chamber. It transforms the thermal energy of expanding gases into linear mechanical motion, which is then passed to the connecting rod.</p>
        
        <h3>2. The Crankshaft</h3>
        <p>The crankshaft is responsible for converting the <strong>reciprocating (linear)</strong> motion of the pistons into <strong>rotational</strong> motion that can drive the wheels. It must be perfectly balanced to prevent high-speed vibrations.</p>
        
        <h3>3. Valvetrain: Camshafts & Valves</h3>
        <p>The Camshaft controls the timing of the intake and exhaust valves. In Overhead Cam (OHC) engines, the camshaft sits atop the cylinder head, allowing for more precise timing and higher RPM capabilities.</p>

        <h3>4. Cylinder Block & Head</h3>
        <p>The block houses the cylinders and cooling jackets, while the head contains the combustion chambers, valves, and spark plugs. Both are typically cast from Aluminum alloy or Iron.</p>
      </div>
    )
  },
  {
    id: 'forced-induction',
    title: 'Forced Induction',
    icon: Wind,
    color: '#06b6d4',
    content: (
      <div className="study-content">
        <h3>1. Why Forced Induction?</h3>
        <p>An engine is essentially an air pump. To make more power, you need more air and more fuel. Forced induction pushes air into the combustion chamber at pressures higher than atmospheric pressure.</p>
        
        <h3>2. Turbochargers</h3>
        <p>A turbocharger uses <strong>exhaust gases</strong> to spin a turbine, which in turn spins a compressor to shove more air into the intake. It is "free" energy reclaimed from the exhaust, but can suffer from "Turbo Lag".</p>

        <h3>3. Superchargers</h3>
        <p>Unlike turbos, superchargers are <strong>mechanically driven</strong> by the engine's crankshaft via a belt. This provides instant throttle response but consumes some engine power to operate (parasitic loss).</p>
        
        <h3>4. Intercooling</h3>
        <p>Compressing air makes it hot. Hot air is less dense and increases the risk of knock. Intercoolers act as radiators for the intake air, cooling it down before it enters the engine for maximum density.</p>
      </div>
    )
  },
  {
    id: 'fluid-mechanics',
    title: 'Fluid Dynamics',
    icon: Droplets,
    color: '#3b82f6',
    content: (
      <div className="study-content">
        <h3>1. Lubrication Systems</h3>
        <p>Oil is the lifeblood of an engine. It reduces friction between moving parts, carries away heat, and cleans internal surfaces. Most engines use a "Wet Sump" system where oil is stored in a pan at the bottom.</p>
        
        <h3>2. Bernoulli's Principle in Carbs</h3>
        <p>In older carbureted engines, Bernoulli's principle is used to draw fuel into the air stream. As air passes through a narrow venturi, its velocity increases and pressure drops, sucking fuel out of the nozzle.</p>
      </div>
    )
  },
  {
    id: 'materials',
    title: 'Material Science',
    icon: BookOpen,
    color: '#10b981',
    content: (
      <div className="study-content">
        <h3>1. High-Performance Alloys</h3>
        <p>Engine components face extreme heat and pressure. Pistons are often made of <strong>Hypereutectic Aluminum</strong> for low thermal expansion, while valves may use <strong>Inconel</strong> (a nickel-chromium superalloy) to withstand exhaust temperatures exceeding 800°C.</p>
      </div>
    )
  }
]

export default function Academy() {
  const [activeTopic, setActiveTopic] = useState(ACADEMY_DATA[0].id)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentData = ACADEMY_DATA.find(d => d.id === activeTopic)

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingTop: '100px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar */}
        <div style={{ width: '100%', maxWidth: '300px', flexShrink: 0 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              marginBottom: '2rem', transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Return to Hub
          </button>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Modules</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ACADEMY_DATA.map((topic) => {
              const Icon = topic.icon
              const isActive = activeTopic === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                    background: isActive ? `rgba(${hexToRgb(topic.color)}, 0.15)` : 'transparent',
                    border: isActive ? `1px solid ${topic.color}` : '1px solid transparent',
                    color: isActive ? topic.color : 'rgba(255,255,255,0.6)',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: isActive ? `0 0 20px rgba(${hexToRgb(topic.color)}, 0.1)` : 'none'
                  }}
                >
                  <Icon size={18} />
                  {topic.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div 
          key={activeTopic}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ flex: 1, minWidth: '300px', background: 'rgba(20,20,20,0.6)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', padding: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: `rgba(${hexToRgb(currentData.color)}, 0.2)`, color: currentData.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <currentData.icon size={24} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: 0, color: currentData.color }}>
              {currentData.title}
            </h1>
          </div>

          <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
            {currentData.content}
          </div>
        </motion.div>
        
      </div>

      <style>{`
        .study-content h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-family: 'Outfit', sans-serif;
        }
        .study-content p {
          margin-bottom: 1.5rem;
        }
        .study-content ul {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 2rem;
        }
        .study-content li {
          background: rgba(255,255,255,0.03);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          border-left: 4px solid #3b82f6;
        }
        .study-content strong {
          color: #60a5fa;
        }
        .formula-box {
          background: rgba(0,0,0,0.5);
          padding: 1.5rem;
          border-radius: 0.5rem;
          font-family: monospace;
          font-size: 1.25rem;
          color: #34d399;
          text-align: center;
          margin: 1.5rem 0;
          border: 1px dashed rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255,255,255';
}
