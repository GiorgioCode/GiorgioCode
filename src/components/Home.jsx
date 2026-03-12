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
  Grid,
  List,
  ListItem,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaFileDownload, FaBriefcase, FaLightbulb, FaCogs } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionBox = motion.create(Box)

const SectionCard = ({ children, delay = 0, ...props }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    p={{ base: 6, xl: 4 }}
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

  const ctaBg = useColorModeValue('gray.800', 'dracula.purple')
  const ctaHoverBg = useColorModeValue('gray.900', 'dracula.currentLine')

  return (
    <Container maxW="1800px" px={{ base: 4, xl: 6 }} as="article" aria-label="Professional profile">
      <VStack spacing={{ base: 8, xl: 4 }} align="stretch" as="section">
        {/* Fila 1 (xl): Hero compacto + Descripción — misma altura, contenido alineado */}
        <Grid
          templateColumns={{ base: '1fr', xl: 'auto 1fr' }}
          gap={{ base: 0, xl: 6 }}
          alignItems="stretch"
          minHeight={{ xl: 0 }}
        >
          <MotionBox
            as="section"
            aria-label="Profile headline"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            py={{ base: 6, xl: 0 }}
            display={{ base: 'block', xl: 'flex' }}
            flexDirection={{ xl: 'column' }}
            alignItems={{ xl: 'center' }}
            justifyContent={{ xl: 'center' }}
            minH={{ xl: '140px' }}
          >
            <Flex direction="column" align="center" gap={4} w="100%">
              <Image
                src="/images/portfolio.png"
                alt={t('home.title')}
                borderRadius="full"
                boxSize={{ base: '160px', md: '140px', xl: '120px' }}
                objectFit="cover"
                border="3px solid"
                borderColor={borderColor}
                boxShadow="md"
                flexShrink={0}
                _hover={{
                  borderColor: useColorModeValue('gray.400', 'dracula.purple'),
                }}
              />
              <Box>
                <Heading as="h1" size={{ base: '2xl', xl: 'xl' }} mb={2} color={headingColor} fontWeight="600">
                  {t('home.title')}
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl', xl: 'md' }} color={subTextColor} fontWeight="medium" lineHeight="tight">
                  {t('home.subtitle')}
                </Text>
              </Box>
            </Flex>
          </MotionBox>
          <SectionCard delay={0.1} display={{ xl: 'flex' }} flexDirection={{ xl: 'column' }} justifyContent={{ xl: 'center' }} minH={{ xl: '140px' }}>
            <Text fontSize="lg" lineHeight="tall" color={textColor} mb={{ base: 4, xl: 2 }}>
              {t('home.description')}
            </Text>
            <Text fontSize="lg" lineHeight="tall" color={subTextColor}>
              {t('home.descriptionExtended')}
            </Text>
          </SectionCard>
        </Grid>

        {/* Fila 2: Trabajo actual + Intereses + Stack (3 columnas en xl) */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
          <SectionCard delay={0.2}>
            <Flex align="center" gap={2} mb={{ base: 3, xl: 2 }}>
              <Icon as={FaBriefcase} color={iconColor} boxSize={5} />
              <Heading as="h2" size="md" color={sectionHeadingColor}>
                {t('home.currentWorkTitle')}
              </Heading>
            </Flex>
            <List as="ul" spacing={2} fontSize="lg" lineHeight="tall" color={textColor} listStyleType="disc" listStylePos="inside">
              {t('home.currentWorkItems', { returnObjects: true }).map((item, idx) => (
                <ListItem key={`current-work-${idx}`}>{item}</ListItem>
              ))}
            </List>
          </SectionCard>
          <SectionCard delay={0.25}>
            <Flex align="center" gap={2} mb={{ base: 3, xl: 2 }}>
              <Icon as={FaLightbulb} color={iconColor} boxSize={5} />
              <Heading as="h2" size="md" color={sectionHeadingColor}>
                {t('home.interestsTitle')}
              </Heading>
            </Flex>
            <List as="ul" spacing={2} fontSize="lg" lineHeight="tall" color={textColor} listStyleType="disc" listStylePos="inside">
              {t('home.interestsItems', { returnObjects: true }).map((item, idx) => (
                <ListItem key={`interest-${idx}`}>{item}</ListItem>
              ))}
            </List>
          </SectionCard>
          <SectionCard delay={0.3}>
            <Flex align="center" gap={2} mb={{ base: 3, xl: 2 }}>
              <Icon as={FaCogs} color={iconColor} boxSize={5} />
              <Heading as="h2" size="md" color={sectionHeadingColor}>
                {t('home.techFocusTitle')}
              </Heading>
            </Flex>
            <List as="ul" spacing={2} fontSize="lg" lineHeight="tall" color={textColor} listStyleType="disc" listStylePos="inside">
              <ListItem>{t('home.techFocusBackend')}</ListItem>
              <ListItem>{t('home.techFocusFrontend')}</ListItem>
              <ListItem>{t('home.techFocusDatabases')}</ListItem>
              <ListItem>{t('home.techFocusEmbedded')}</ListItem>
              <ListItem>{t('home.techFocusInfra')}</ListItem>
            </List>
          </SectionCard>
        </SimpleGrid>

        <Divider borderColor={borderColor} />

        {/* Fila 3: Contacto + CTA + Redes y CV (todo en una línea en xl) */}
        <Flex
          direction={{ base: 'column', xl: 'row' }}
          gap={{ base: 4, xl: 6 }}
          align={{ base: 'stretch', xl: 'center' }}
          wrap="wrap"
        >
          <MotionBox
            as="section"
            aria-label="Contact information"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            p={{ base: 6, xl: 4 }}
            borderWidth="1px"
            borderRadius="xl"
            borderColor={borderColor}
            bg={cardBg}
            boxShadow="sm"
            flex={{ base: '1 1 100%', xl: '1 1 auto' }}
          >
            <HStack spacing={6} flexWrap="wrap">
              <HStack spacing={2}>
                <Icon as={FaMapMarkerAlt} color={iconColor} boxSize={5} flexShrink={0} aria-hidden />
                <Text fontSize="lg" color={textColor}>
                  {t('home.location')}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaEnvelope} color={iconColor} boxSize={5} flexShrink={0} />
                <Link
                  href={`mailto:${t('home.contact')}`}
                  color={textColor}
                  fontSize="lg"
                  _hover={{ color: iconColor, textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault()
                    copyEmail()
                  }}
                  title={t('home.emailCopiedDesc')}
                >
                  {t('home.contact')}
                </Link>
              </HStack>
            </HStack>
          </MotionBox>

          <HStack spacing={3} flexWrap="wrap" justify={{ base: 'center', xl: 'flex-start' }}>
            <Link as={RouterLink} to="/contact" _hover={{ textDecoration: 'none' }}>
              <Button
                size="lg"
                bg={ctaBg}
                color="white"
                _hover={{ bg: ctaHoverBg, transform: 'translateY(-1px)', shadow: 'md' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s"
              >
                {t('navigation.contact')}
              </Button>
            </Link>
            <Link href="https://linkedin.com/in/jorge-angel-paez" isExternal>
              <Button
                leftIcon={<FaLinkedin />}
                colorScheme="linkedin"
                variant="ghost"
                size="md"
                _hover={{ bg: useColorModeValue('gray.100', 'dracula.currentLine'), transform: 'translateY(-2px)', shadow: 'md' }}
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
                size="md"
                _hover={{ bg: useColorModeValue('gray.100', 'dracula.currentLine'), transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                GitHub
              </Button>
            </Link>
            <Link href={`/cv/jorge_paez_resume_${i18n.language}.pdf`} download>
              <Button
                leftIcon={<FaFileDownload />}
                variant="outline"
                size="md"
                borderColor={borderColor}
                color={textColor}
                _hover={{ bg: useColorModeValue('gray.100', 'dracula.currentLine'), transform: 'translateY(-1px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                {t('home.downloadCV')}
              </Button>
            </Link>
          </HStack>
        </Flex>
      </VStack>
    </Container>
  )
}

export default Home
