import { useEffect, useRef } from 'react'
import './Events.css'

function Events({ events }) {
  const eventCardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    eventCardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="section" id="events"></div>
      <section className="events-section">
        <h2 className="section-title">الفعاليات والأنشطة</h2>
        <div className="events-grid">
          {events.map((event, index) => (
            <div
              key={index}
              ref={el => eventCardsRef.current[index] = el}
              className="event-card"
            >
              <img src={event.image} alt={event.title} className="event-image" />
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Events
