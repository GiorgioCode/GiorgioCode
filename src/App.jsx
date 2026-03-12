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
import { useTranslation } from 'react-i18next'
import { usePageSEO } from './hooks/usePageSEO'

const AppContent = () => {
  const location = useLocation()
  const { t } = useTranslation()
  usePageSEO()
  const { colorMode } = useColorMode()
  const bgGradient = useColorModeValue(
    'linear(to-b, #f1f5f9, #e2e8f0)',
    'linear(to-b, #0f1219, #1e293b)'
  )

  const textColor = useColorModeValue('gray.800', '#e2e8f0')
  const borderColor = useColorModeValue('gray.200', '#1e293b')

  return (
    <Box 
      minH="100vh" 
      bgGradient={bgGradient}
      color={textColor}
      transition="all 0.2s ease"
      position="relative"
      overflow="hidden"
    >
      <Box
        as="a"
        href="#main-content"
        position="absolute"
        left="-9999px"
        zIndex={100}
        bg={useColorModeValue('white', 'gray.800')}
        color={textColor}
        px={4}
        py={2}
        fontWeight="semibold"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        _focus={{ left: 4, top: '72px' }}
        transition="left 0.2s"
      >
        {t('a11y.skipToContent')}
      </Box>
      <ParticlesBackground />
      <Navbar />
      <Container 
        as="main"
        id="main-content"
        maxW="1800px"
        mt="64px"
        py={8}
        px={{ base: 4, md: 8, xl: 10 }}
        position="relative"
        zIndex={1}
        tabIndex={-1}
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
