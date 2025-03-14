import { motion } from 'framer-motion'
import { useColorModeValue } from '@chakra-ui/react'

const PageTransition = ({ children }) => {
  const accentGradient = useColorModeValue(
    'linear(to-r, blue.300, blue.100)',
    'linear(to-r, dracula.purple, dracula.pink)'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      style={{
        width: '100%',
        position: 'relative'
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: -2,
          left: 0,
          right: 0,
          height: 2,
          background: accentGradient,
          transformOrigin: 'left'
        }}
      />
      {children}
    </motion.div>
  )
}

export default PageTransition
