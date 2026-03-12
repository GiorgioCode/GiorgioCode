import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  Icon,
  useColorModeValue,
  Container,
  Button,
  Image,
  useToast,
  SimpleGrid,
  Divider,
  Flex,
} from '@chakra-ui/react'
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaFileDownload, FaBriefcase, FaLightbulb, FaCogs } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionBox = motion.create(Box)

const SectionCard = ({ children, delay = 0, ...props }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    p={6}
    borderWidth="1px"
    borderRadius="xl"
    borderColor={useColorModeValue('gray.200', 'dracula.currentLine')}
    bg={useColorModeValue('white', 'dracula.bg')}
    boxShadow="sm"
    _hover={{
      borderColor: useColorModeValue('gray.300', 'dracula.purple'),
      transition: 'border-color 0.2s',
    }}
    {...props}
  >
    {children}
  </MotionBox>
)

const Home = () => {
  const { t, i18n } = useTranslation()
  const borderColor = useColorModeValue('gray.200', 'dracula.currentLine')
  const textColor = useColorModeValue('gray.800', 'dracula.foreground')
  const subTextColor = useColorModeValue('gray.600', 'dracula.comment')
  const cardBg = useColorModeValue('white', 'dracula.bg')
  const iconColor = useColorModeValue('gray.600', 'dracula.purple')
  const headingColor = useColorModeValue('gray.800', 'dracula.foreground')
  const sectionHeadingColor = useColorModeValue('gray.700', 'dracula.purple')
  const toast = useToast()

  const copyEmail = () => {
    const email = t('home.contact')
    navigator.clipboard.writeText(email)
    toast({
      title: t('home.emailCopied'),
      description: t('home.emailCopiedDesc'),
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom',
      variant: 'subtle',
      bg: useColorModeValue('gray.700', 'dracula.purple'),
      color: useColorModeValue('white', 'dracula.foreground'),
    })
  }

  return (
    <Container maxW="container.lg" as="article" aria-label="Professional profile">
      <VStack spacing={8} align="stretch" as="section">
        {/* Hero: foto, nombre, subtítulo */}
        <MotionBox
          as="section"
          aria-label="Profile headline"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          py={6}
        >
          <Box mb={6} display="flex" justifyContent="center">
            <Image
              src="/images/portfolio.png"
              alt={t('home.title')}
              borderRadius="full"
              boxSize={{ base: '160px', md: '200px' }}
              objectFit="cover"
              border="4px solid"
              borderColor={borderColor}
              boxShadow="md"
              transition="all 0.2s ease"
              _hover={{
                transform: 'scale(1.02)',
                borderColor: useColorModeValue('gray.400', 'dracula.purple'),
              }}
            />
          </Box>
          <Heading as="h1" size="2xl" mb={3} color={headingColor} fontWeight="600">
            {t('home.title')}
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={subTextColor} fontWeight="medium">
            {t('home.subtitle')}
          </Text>
        </MotionBox>

        {/* Descripción principal */}
        <SectionCard delay={0.1}>
          <Text fontSize="md" lineHeight="tall" color={textColor} mb={4}>
            {t('home.description')}
          </Text>
          <Text fontSize="md" lineHeight="tall" color={subTextColor}>
            {t('home.descriptionExtended')}
          </Text>
        </SectionCard>

        {/* Trabajo actual + Intereses (grid en desktop) */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <SectionCard delay={0.2}>
            <Flex align="center" gap={2} mb={3}>
              <Icon as={FaBriefcase} color={iconColor} boxSize={5} />
              <Heading as="h2" size="sm" color={sectionHeadingColor}>
                {t('home.currentWorkTitle')}
              </Heading>
            </Flex>
            <Text fontSize="sm" lineHeight="tall" color={textColor}>
              {t('home.currentWork')}
            </Text>
          </SectionCard>
          <SectionCard delay={0.25}>
            <Flex align="center" gap={2} mb={3}>
              <Icon as={FaLightbulb} color={iconColor} boxSize={5} />
              <Heading as="h2" size="sm" color={sectionHeadingColor}>
                {t('home.interestsTitle')}
              </Heading>
            </Flex>
            <Text fontSize="sm" lineHeight="tall" color={textColor}>
              {t('home.interests')}
            </Text>
          </SectionCard>
        </SimpleGrid>

        {/* Stack y entornos */}
        <SectionCard delay={0.3}>
          <Flex align="center" gap={2} mb={3}>
            <Icon as={FaCogs} color={iconColor} boxSize={5} />
            <Heading as="h2" size="sm" color={sectionHeadingColor}>
              {t('home.techFocusTitle')}
            </Heading>
          </Flex>
          <Text fontSize="sm" lineHeight="tall" color={textColor}>
            {t('home.techFocus')}
          </Text>
        </SectionCard>

        <Divider borderColor={borderColor} />

        {/* Contacto: solo ubicación + email (sin teléfono) */}
        <MotionBox
          as="section"
          aria-label="Contact information"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="sm"
        >
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Icon as={FaMapMarkerAlt} color={iconColor} boxSize={5} flexShrink={0} aria-hidden />
              <Text fontSize="md" color={textColor}>
                {t('home.location')}
              </Text>
            </HStack>
            <HStack spacing={4}>
              <Icon as={FaEnvelope} color={iconColor} boxSize={5} flexShrink={0} />
              <Link
                href={`mailto:${t('home.contact')}`}
                color={textColor}
                _hover={{
                  color: iconColor,
                  textDecoration: 'none',
                }}
                onClick={(e) => {
                  e.preventDefault()
                  copyEmail()
                }}
                title={t('home.emailCopiedDesc')}
              >
                <Text fontSize="md">{t('home.contact')}</Text>
              </Link>
            </HStack>
          </VStack>
        </MotionBox>

        {/* Redes y CV */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <VStack spacing={6} align="center" pt={2}>
            <HStack spacing={6} justify="center" flexWrap="wrap">
              <Link href="https://linkedin.com/in/jorge-angel-paez" isExternal>
                <Button
                  leftIcon={<FaLinkedin />}
                  colorScheme="linkedin"
                  variant="ghost"
                  size="lg"
                  _hover={{
                    bg: useColorModeValue('gray.100', 'dracula.currentLine'),
                    transform: 'translateY(-2px)',
                    shadow: 'md',
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
                    bg: useColorModeValue('gray.100', 'dracula.currentLine'),
                    transform: 'translateY(-2px)',
                    shadow: 'md',
                  }}
                  transition="all 0.2s"
                >
                  GitHub
                </Button>
              </Link>
            </HStack>
            <Link href={`/cv/jorge_paez_resume_${i18n.language}.pdf`} download>
              <Button
                leftIcon={<FaFileDownload />}
                variant="solid"
                size="lg"
                bg={useColorModeValue('gray.700', 'gray.600')}
                color="white"
                _hover={{
                  transform: 'translateY(-1px)',
                  shadow: 'md',
                  bg: useColorModeValue('gray.800', 'gray.500'),
                }}
                _active={{ transform: 'translateY(0)' }}
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
