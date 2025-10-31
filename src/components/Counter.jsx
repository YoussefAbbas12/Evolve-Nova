import { useState, useEffect, useRef } from 'react'
import './Counter.css'

function Counter() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const targets = [2700, 800, 180, 14]
  const labels = ['تدريبات مختلفة', 'شهادة', 'مشروع', 'فكرة']

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters()
          setHasAnimated(true)
        } else if (!entry.isIntersecting && hasAnimated) {
          setCounts([0, 0, 0, 0])
          setHasAnimated(false)
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateCounters = () => {
    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = progress * (2 - progress)

      const newCounts = targets.map(target => 
        Math.floor(easedProgress * target)
      )
      
      setCounts(newCounts)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="counter-section" ref={counterRef}>
      <div className="counter-line"></div>
      <div className="counter-container">
        {counts.map((count, index) => (
          <div key={index} className="counter-box">
            <span>{count.toLocaleString()}</span>
            {labels[index]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Counter
