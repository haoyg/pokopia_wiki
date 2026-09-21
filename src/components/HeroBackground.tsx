'use client'

import { useEffect, useState } from 'react'

const HERO_IMAGES = [
  '/images/guides/pokopia-official-2.png',
  '/images/guides/pokopia-official-5.png',
  '/images/guides/pokopia-official-6.png',
  '/images/guides/pokopia-official-7.png',
  '/images/guides/pokopia-game-artwork.png',
]

export function HeroBackground() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-bg-slides" aria-hidden="true">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`hero-bg-slide${i === index ? ' active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  )
}
