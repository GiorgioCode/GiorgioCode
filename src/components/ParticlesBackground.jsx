import { useEffect, useRef, useState } from 'react'
import { Box, useColorMode } from '@chakra-ui/react'

const ParticlesBackground = () => {
  const { colorMode } = useColorMode()
  const canvasRef = useRef(null)
  const [particles, setParticles] = useState([])
  const animationFrameRef = useRef()

  useEffect(() => {
    const numParticles = 40
    const newParticles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: Math.random() * 1.5 + 0.5
    }))
    setParticles(newParticles)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Theme colors - Using stronger blues for light mode
    const particleColor = colorMode === 'light' ? '#1A365D' : '#ff79c6' // Very dark blue in light mode, Pink in dark mode
    const lineColor = colorMode === 'light' ? '#2A4365' : '#bd93f9' // Dark blue in light mode, Purple in dark mode
    const particleOpacity = colorMode === 'light' ? 0.8 : 0.6
    const lineOpacity = colorMode === 'light' ? 0.6 : 0.3

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${particleColor}${Math.floor(particleOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x
          const dy = otherParticle.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `${lineColor}${Math.floor((1 - distance / 150) * lineOpacity * 255).toString(16).padStart(2, '0')}`
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particles, colorMode])

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top={0}
      left={0}
      zIndex={1}
      sx={{
        pointerEvents: 'none',
        opacity: colorMode === 'light' ? 0.9 : 0.7,
        transition: 'opacity 0.2s ease'
      }}
    />
  )
}

export default ParticlesBackground
