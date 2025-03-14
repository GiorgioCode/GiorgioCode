import { Box, VStack, Heading, Text, Divider, Container, useColorModeValue, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionBox = motion.create(Box)

const EducationItem = ({ title, institution, period, status, delay = 0 }) => {
  const bgColor = useColorModeValue('light.card', 'dracula.bg')
  const borderColor = useColorModeValue('light.border', 'dracula.currentLine')
  const headingColor = useColorModeValue('light.accent', 'dracula.purple')
  const textColor = useColorModeValue('light.text', 'dracula.foreground')
  const subTextColor = useColorModeValue('light.subtext', 'dracula.comment')

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: useColorModeValue('lg', 'dark-lg'),
    borderColor: useColorModeValue('light.accent', 'dracula.purple'),
    transition: 'all 0.2s'
  }

  return (
    <MotionBox
      mb={6}
      p={8}
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      _hover={cardHoverStyle}
    >
      <Heading as="h3" size="md" color={headingColor} mb={3}>
        {title}
        {status && (
          <Badge 
            ml={2} 
            colorScheme={useColorModeValue('blue', 'purple')} 
            fontSize="0.8em"
            px={3}
            py={1}
            borderRadius="full"
            bgColor={useColorModeValue('light.accent', 'dracula.purple')}
            color={useColorModeValue('white', 'dracula.foreground')}
          >
            {status}
          </Badge>
        )}
      </Heading>
      <Text fontWeight="bold" color={textColor} mb={2}>
        {institution}
      </Text>
      <Text fontSize="sm" color={subTextColor}>
        {period}
      </Text>
    </MotionBox>
  )
}

const Education = () => {
  const { t } = useTranslation()

  const education = [
    {
      title: "Computer Science Degree",
      titleEs: "Licenciatura en Informática",
      institution: "Universidad Empresarial Siglo XXI, Córdoba",
      period: "2023 - Present",
      periodEs: "2023 - Presente",
      status: "In Progress",
      statusEs: "En curso"
    },
    {
      title: "Master in Business Administration (MBA)",
      titleEs: "Magister en Administración de Negocios (MBA)",
      institution: "International Institute of Global Studies for Human Development, Málaga, Spain",
      institutionEs: "Instituto Internacional de Estudios Globales para el Desarrollo Humano, Málaga, España",
      period: "2018 - 2019"
    },
    {
      title: "Specialist in Telecommunications Systems",
      titleEs: "Especialista en Sistemas de Telecomunicaciones",
      institution: "National Defense University UNDEF, Puerto Belgrano",
      institutionEs: "Universidad Nacional de la Defensa UNDEF, Puerto Belgrano",
      period: "2010 - 2011"
    },
    {
      title: "Bachelor in Administration",
      titleEs: "Licenciado en Administración",
      institution: "National Defense University UNDEF, La Plata",
      institutionEs: "Universidad Nacional de la Defensa UNDEF, La Plata",
      period: "2004 - 2008"
    },
    {
      title: "Electronics Technician",
      titleEs: "Técnico en Electrónica",
      institution: "National Technical Education School 1, Punta Alta",
      institutionEs: "Escuela Nacional de Educación Técnica 1, Punta Alta",
      period: "2001 - 2003"
    }
  ]

  const certifications = [
    {
      title: "Scrum Foundation Professional Certificate (SFPC)",
      institution: "CertiProf",
      period: "2022"
    },
    {
      title: "SCF - Scrum Certified Fundamentals",
      institution: "SCRUM Study",
      period: "2022"
    },
    {
      title: "Installation, repair and maintenance of Vision Master FT Radar & ECDIS",
      titleEs: "Instalación, reparación y mantenimiento de Vision Master FT Radar & ECDIS",
      institution: "Northrop Grumman Sperry Marine Support Center, New Orleans, USA",
      period: "2018"
    }
  ]

  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  const getLocalizedData = (item) => ({
    title: currentLanguage === 'es' && item.titleEs ? item.titleEs : item.title,
    institution: currentLanguage === 'es' && item.institutionEs ? item.institutionEs : item.institution,
    period: currentLanguage === 'es' && item.periodEs ? item.periodEs : item.period,
    status: currentLanguage === 'es' && item.statusEs ? item.statusEs : item.status
  })

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading 
            as="h2" 
            size="xl" 
            mb={6}
            bgGradient={useColorModeValue(
              'linear(to-r, light.accent, light.accentDark)',
              'linear(to-r, dracula.purple, dracula.pink)'
            )}
            bgClip="text"
          >
            {t('education.title')}
          </Heading>
          <Divider mb={6} />
          {education.map((edu, index) => (
            <EducationItem 
              key={index} 
              {...getLocalizedData(edu)} 
              delay={index * 0.2}
            />
          ))}
        </MotionBox>

        <MotionBox
          mt={8}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Heading 
            as="h2" 
            size="xl" 
            mb={6}
            bgGradient={useColorModeValue(
              'linear(to-r, light.accent, light.accentDark)',
              'linear(to-r, dracula.purple, dracula.pink)'
            )}
            bgClip="text"
          >
            {t('education.certifications')}
          </Heading>
          <Divider mb={6} />
          {certifications.map((cert, index) => (
            <EducationItem 
              key={`cert-${index}`} 
              {...getLocalizedData(cert)} 
              delay={0.6 + index * 0.2}
            />
          ))}
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default Education
