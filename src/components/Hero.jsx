import { useState, useEffect } from 'react'
import './Hero.css'

function Hero({ title, subtitle, description, images, showBackButton = false }) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="hero" id="home">
      <div className="floating-squares">
        {[...Array(60)].map((_, i) => (
          <FloatingSymbol key={i} />
        ))}
      </div>
      
      <div className="hero-text">
        <h1>
          {title.en}<span className="highlight-orange"> {title.enHighlight}</span><br />
          {title.ar}<span className="highlight-blue"> {title.arHighlight}</span>
        </h1>
        <p>{description}</p>
        
        <div className="hero-buttons">
          <a href="#events" className="btn-orange">استكشف الموارد</a>
          <a href="#video" className="btn-white">الإنفوجرافيك الخاص بنا</a>
        </div>
        
        <div className="stats-box">
          <div className="stats-info">
            <span>+4000 شاب</span>
            <span>استفادوا من خلالنا</span>
          </div>
          <div className="stats-circles">
            <span className="year y2025">2</span>
            <span className="year y2022">0</span>
            <span className="year y2020">2</span>
            <span className="year y2025">5</span>
          </div>
        </div>
      </div>
      
      <div className="hero-img">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={index === currentImage ? 'active' : ''}
            alt={`Hero ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function FloatingSymbol() {
  const symbols = [
    '{}', '<>', '()', '[]', '</>', 
    'var', 'const', 'let', 'if', 'for', 
    'while', '=>', 'true', 'false', 'null', 
    'function', 'return', 'async', 'await',
    'class', 'import', 'export', 'React',
    'HTML', 'CSS', 'JS', '💻', '🚀', '⚡'
  ]

  const colors = [
    '#f18c7e', '#66bfbf', '#191c3c', 
    '#4CAF50', '#2196F3', '#FF6B6B', 
    '#4ECDC4', '#95E1D3'
  ]

  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = Math.floor(Math.random() * 16) + 14
  const startX = Math.random() * 100
  const startY = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 13 + 12
  const direction = Math.random() > 0.5 ? 'floatSquareLeft' : 'floatSquareRight'

  return (
    <span
      style={{
        fontSize: `${size}px`,
        color: color,
        left: `${startX}%`,
        top: `${startY}%`,
        animation: `${direction} ${duration}s linear ${delay}s infinite`,
        opacity: 0.7,
        fontFamily: 'Courier New, monospace',
        pointerEvents: 'none',
        position: 'absolute'
      }}
    >
      {symbol}
    </span>
  )
}

export default Hero
