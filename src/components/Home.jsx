import { Box, Heading, Text, VStack, HStack, Link, Icon, useColorModeValue, Container, Button, Image, useToast } from '@chakra-ui/react'
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaFileDownload } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionBox = motion.create(Box)

const Home = () => {
  const { t, i18n } = useTranslation()
  const borderColor = useColorModeValue('light.border', 'dracula.currentLine')
  const textColor = useColorModeValue('light.text', 'dracula.foreground')
  const subTextColor = useColorModeValue('light.subtext', 'dracula.purple')
  const cardBg = useColorModeValue('light.card', 'dracula.bg')
  const iconColor = useColorModeValue('light.accent', 'dracula.purple')
  const buttonHoverBg = useColorModeValue('light.hover', 'dracula.currentLine')
  const linkedinHoverBg = useColorModeValue('light.hover', 'dracula.currentLine')
  const toast = useToast()
  
  const headingGradient = useColorModeValue(
    'linear(to-r, light.accent, light.accentDark)',
    'linear(to-r, dracula.purple, dracula.pink)'
  )

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: useColorModeValue('lg', 'dark-lg'),
    borderColor: useColorModeValue('blue.200', 'dracula.purple'),
    transition: 'all 0.2s'
  }

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          py={6}
        >
          <Box
            mb={6}
            display="flex"
            justifyContent="center"
          >
            <Image
              src="/images/perfil.png"
              alt="Jorge Angel Paez"
              borderRadius="full"
              boxSize="200px"
              objectFit="cover"
              border="4px solid"
              borderColor={useColorModeValue('light.accent', 'dracula.purple')}
              boxShadow="xl"
              transition="all 0.3s ease"
              _hover={{
                transform: 'scale(1.05)',
                borderColor: useColorModeValue('light.accentDark', 'dracula.pink')
              }}
            />
          </Box>
          <Heading 
            as="h1" 
            size="2xl" 
            mb={4}
            bgGradient={headingGradient}
            bgClip="text"
          >
            {t('home.title')}
          </Heading>
          <Text 
            fontSize="xl" 
            color={subTextColor}
            fontWeight="medium"
          >
            {t('home.subtitle')}
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          p={8}
          borderWidth="1px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="md"
          _hover={cardHoverStyle}
        >
          <Text fontSize="lg" lineHeight="tall" color={textColor}>
            {t('home.description')}
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          p={8}
          borderWidth="1px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="md"
          _hover={cardHoverStyle}
        >
          <HStack spacing={4} mb={4}>
            <Icon as={FaMapMarkerAlt} color={iconColor} boxSize={5} />
            <Text fontSize="md" color={textColor}>
              {t('home.location')}
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Icon as={FaEnvelope} color={iconColor} boxSize={5} />
            <Link 
              href={`mailto:${t('home.contact')}`}
              color={textColor}
              _hover={{ 
                color: useColorModeValue('light.accent', 'dracula.purple'),
                textDecoration: 'none' 
              }}
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(t('home.contact'));
                toast({
                  title: t('home.emailCopied'),
                  description: t('home.emailCopiedDesc'),
                  status: 'success',
                  duration: 2000,
                  isClosable: true,
                  position: 'bottom',
                  variant: 'subtle',
                  bg: useColorModeValue('light.accent', 'dracula.purple'),
                  color: useColorModeValue('white', 'dracula.foreground')
                });
              }}
              title="Click to copy email"
            >
              <Text 
                fontSize="md" 
                _hover={{ color: 'inherit' }}
              >
                {t('home.contact')}
              </Text>
            </Link>
          </HStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <VStack spacing={6} align="center" pt={4}>
            <HStack spacing={6} justify="center">
              <Link href="https://linkedin.com/in/jorge-angel-paez" isExternal>
                <Button
                  leftIcon={<FaLinkedin />}
                  colorScheme="linkedin"
                  variant="ghost"
                  size="lg"
                  _hover={{ 
                    bg: linkedinHoverBg, 
                    transform: 'translateY(-2px)',
                    shadow: 'md'
                  }}
                  transition="all 0.2s"
                >
                  LinkedIn
                </Button>
              </Link>
              <Link href="https://github.com/GiorgioCode" isExternal>
                <Button
                  leftIcon={<FaGithub />}
                  colorScheme="blue"
                  variant="ghost"
                  size="lg"
                  _hover={{ 
                    bg: buttonHoverBg, 
                    transform: 'translateY(-2px)',
                    shadow: 'md'
                  }}
                  transition="all 0.2s"
                >
                  GitHub
                </Button>
              </Link>
            </HStack>
            <Link href={`/cv/CV-PAEZ-${i18n.language.toUpperCase()}.pdf`} download>
              <Button
                leftIcon={<FaFileDownload />}
                colorScheme="blue"
                variant="solid"
                size="lg"
                bgGradient={headingGradient}
                color="white"
                _hover={{ 
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                  opacity: 0.9
                }}
                _active={{
                  transform: 'translateY(0)',
                  opacity: 0.8
                }}
                transition="all 0.2s"
              >
                {t('home.downloadCV')}
              </Button>
            </Link>
          </VStack>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default Home
