import { Box, VStack, Heading, Text, Divider, useColorModeValue, Badge, ScaleFade, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const ExperienceItem = ({ title, company, period, description, delay = 0 }) => {
  const bgColor = useColorModeValue('light.card', 'dracula.bg')
  const borderColor = useColorModeValue('light.border', 'dracula.currentLine')
  const headingColor = useColorModeValue('light.accent', 'dracula.purple')
  const companyColor = useColorModeValue('light.text', 'dracula.foreground')
  const textColor = useColorModeValue('light.subtext', 'dracula.comment')

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: useColorModeValue('lg', 'dark-lg'),
    borderColor: useColorModeValue('light.accent', 'dracula.purple'),
    transition: 'all 0.2s'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Box
        mb={6}
        p={8}
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        bg={bgColor}
        boxShadow="md"
        _hover={cardHoverStyle}
        transition="all 0.2s"
      >
        <Heading as="h3" size="md" color={headingColor} mb={3}>
          {title}
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
            {period}
          </Badge>
        </Heading>
        <Text fontWeight="bold" color={companyColor} mb={3}>
          {company}
        </Text>
        <Text color={textColor}>{description}</Text>
      </Box>
    </motion.div>
  )
}

const Experience = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const experiences = [
    {
      title: "JavaScript & Python Instructor",
      titleEs: "Instructor de JavaScript & Python",
      company: "EducacionIT, Buenos Aires",
      period: "2022 - Present",
      periodEs: "2022 - Presente",
      description: "Development and delivery of JavaScript and Python training programs. Supporting students in their learning process.",
      descriptionEs: "Desarrollo e impartición de programas formativos en JavaScript y Python. Acompañamiento a estudiantes en su proceso de aprendizaje."
    },
    {
      title: "JavaScript Tutor",
      titleEs: "Tutor de JavaScript",
      company: "Coderhouse, Buenos Aires",
      period: "2022 - 2023",
      description: "Tutoring and support for students in JavaScript courses. Review and feedback of practical projects.",
      descriptionEs: "Tutoría y soporte a estudiantes en cursos de JavaScript. Revisión y feedback de proyectos prácticos."
    },
    {
      title: "Front End Developer",
      titleEs: "Desarrollador Front End",
      company: "Freelance",
      period: "2019 - Present",
      periodEs: "2019 - Presente",
      description: "Design and development of user interfaces. Implementation of web solutions with React and JavaScript.",
      descriptionEs: "Diseño y desarrollo de interfaces de usuario. Implementación de soluciones web con React y JavaScript."
    },
    {
      title: "Head of Communications and IT",
      titleEs: "Jefe de comunicaciones e informática",
      company: "Armada Argentina",
      period: "2004 - Present",
      periodEs: "2004 - Presente",
      description: "Management of communications and IT systems. Supervision of technical teams.",
      descriptionEs: "Gestión de sistemas de comunicaciones e informática. Supervisión de equipos técnicos."
    },
    {
      title: "Unix and Linux Systems Administrator",
      titleEs: "Administrador de sistemas Unix y Linux",
      company: "Escuela de Ciencias del Mar, Buenos Aires",
      period: "2012 - 2013",
      description: "Administration and maintenance of servers. Resolution of technical incidents.",
      descriptionEs: "Administración y mantenimiento de servidores. Resolución de incidencias técnicas."
    },
    {
      title: "Managing Partner - Front End Developer",
      titleEs: "Socio gerente - Desarrollador Front End",
      company: "Acrux D+D, Trelew",
      period: "2009 - 2013",
      description: "Co-direction of the development company. Design and implementation of web interfaces.",
      descriptionEs: "Co-dirección de la empresa de desarrollo. Diseño e implementación de interfaces web."
    }
  ]

  const getLocalizedData = (item) => ({
    title: currentLanguage === 'es' && item.titleEs ? item.titleEs : item.title,
    company: item.company,
    period: currentLanguage === 'es' && item.periodEs ? item.periodEs : item.period,
    description: currentLanguage === 'es' && item.descriptionEs ? item.descriptionEs : item.description
  })

  const headingGradient = useColorModeValue(
    'linear(to-r, light.accent, light.accentDark)',
    'linear(to-r, dracula.purple, dracula.pink)'
  )

  return (
    <Container maxW="container.lg">
      <VStack spacing={8} align="stretch">
        <Heading 
          as="h2" 
          size="xl" 
          mb={6}
          bgGradient={headingGradient}
          bgClip="text"
        >
          {t('navigation.experience')}
        </Heading>
        <Divider />
        <ScaleFade in={true} initialScale={0.9}>
          <Box>
            {experiences.map((exp, index) => (
              <ExperienceItem
                key={index}
                {...getLocalizedData(exp)}
                delay={index * 0.2}
              />
            ))}
          </Box>
        </ScaleFade>
      </VStack>
    </Container>
  )
}

export default Experience
