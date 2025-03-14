import { Box, Container, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Contact from './components/Contact'
import PageTransition from './components/PageTransition'
import ParticlesBackground from './components/ParticlesBackground'
import Projects from './components/Projects'
import About from './components/About'

const AppContent = () => {
  const location = useLocation()
  const { colorMode } = useColorMode()
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.300, blue.100, white)',
    'linear(to-br, #282a36, #44475a)'
  )

  const textColor = useColorModeValue('gray.700', '#f8f8f2')
  const borderColor = useColorModeValue('blue.100', '#44475a')

  return (
    <Box 
      minH="100vh" 
      bgGradient={bgGradient}
      color={textColor}
      transition="all 0.2s ease"
      position="relative"
      overflow="hidden"
    >
      <ParticlesBackground />
      <Navbar />
      <Container 
        as="main"
        maxW="container.xl" 
        mt="64px"
        py={8}
        px={{ base: 4, md: 8 }}
        position="relative"
        zIndex={1}
      >
        <AnimatePresence mode="wait" initial={true}>
          <Routes key={location.pathname}>
            <Route path="/" element={
              <PageTransition key="home">
                <Home />
              </PageTransition>
            } />
            <Route path="/experience" element={
              <PageTransition key="experience">
                <Experience />
              </PageTransition>
            } />
            <Route path="/education" element={
              <PageTransition key="education">
                <Education />
              </PageTransition>
            } />
            <Route path="/skills" element={
              <PageTransition key="skills">
                <Skills />
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition key="projects">
                <Projects />
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition key="contact">
                <Contact />
              </PageTransition>
            } />
            <Route path="/about" element={
              <PageTransition key="about">
                <About />
              </PageTransition>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Container>
    </Box>
  )
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </Router>
  )
}

export default App
