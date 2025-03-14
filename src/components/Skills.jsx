import { Box, VStack, Heading, Text, SimpleGrid, Tag, Divider, Container, useColorModeValue, Progress, Icon, Center } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaPython, FaJava, FaNodeJs, FaGitAlt, FaSass, FaLinux, FaTasks } from 'react-icons/fa'
import { SiDjango, SiSpring, SiTailwindcss, SiBootstrap, SiMysql, SiPostgresql, SiMongodb, SiFirebase, SiSupabase } from 'react-icons/si'
import { BsKanbanFill } from 'react-icons/bs'

const MotionBox = motion.create(Box)
const MotionTag = motion.create(Tag)

const SkillTag = ({ skill, tagStyle, delay, index }) => {
  const IconComponent = skill.icon
  
  return (
    <MotionTag
      size="lg"
      variant="solid"
      {...tagStyle}
      py={3}
      px={4}
      borderRadius="xl"
      minH="80px"
      minW="110px"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: delay + index * 0.1 }}
      cursor="pointer"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box 
        as="span"
        fontSize="xl"
        color={useColorModeValue('light.accent', 'dracula.purple')}
        transition="all 0.3s"
        _groupHover={{ 
          transform: 'scale(1.2)',
          color: useColorModeValue('light.accentDark', 'dracula.pink')
        }}
      >
        <IconComponent />
      </Box>
      <Text>{skill.name}</Text>
    </MotionTag>
  )
}

const SkillCategory = ({ title, skills, delay = 0 }) => {
  const bgColor = useColorModeValue('light.card', 'dracula.bg')
  const borderColor = useColorModeValue('light.border', 'dracula.currentLine')
  const headingColor = useColorModeValue('light.accent', 'dracula.purple')

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: useColorModeValue('lg', 'dark-lg'),
    borderColor: useColorModeValue('light.accent', 'dracula.purple'),
    transition: 'all 0.2s'
  }

  const tagStyle = {
    bg: useColorModeValue('light.card', 'dracula.bg'),
    color: useColorModeValue('light.text', 'dracula.foreground'),
    borderWidth: '1px',
    borderColor: useColorModeValue('light.border', 'dracula.currentLine'),
    boxShadow: 'md',
    role: 'group',
    _hover: { 
      bg: useColorModeValue('light.hover', 'dracula.currentLine'),
      borderColor: useColorModeValue('light.accent', 'dracula.purple'),
      color: useColorModeValue('light.accent', 'dracula.purple'),
      transform: 'translateY(-5px)',
      boxShadow: 'xl'
    }
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
      <Heading as="h3" size="md" color={headingColor} mb={4}>
        {title}
      </Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={[3, 4]} mt={2}>
        {skills.map((skill, index) => (
          <SkillTag
            key={index}
            skill={skill}
            tagStyle={tagStyle}
            delay={delay}
            index={index}
          />
        ))}
      </SimpleGrid>
    </MotionBox>
  )
}

const LanguageItem = ({ language, level, delay = 0 }) => {
  const textColor = useColorModeValue('gray.700', 'dracula.foreground')
  const subTextColor = useColorModeValue('gray.600', 'dracula.comment')
  
  const levelToProgress = {
    'Native': 100,
    'Advanced': 85,
    'Intermediate': 60,
    'Basic': 40,
    'Nativo': 100,
    'Avanzado': 85,
    'Intermedio': 60,
    'Básico': 40
  }

  return (
    <MotionBox
      mb={4}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Text fontWeight="bold" color={textColor} mb={2}>{language}</Text>
      <Text color={subTextColor} mb={3} fontSize="sm">{level}</Text>
      <Progress
        value={levelToProgress[level]}
        colorScheme={useColorModeValue('blue', 'purple')}
        borderRadius="full"
        size="sm"
        hasStripe
        isAnimated
        sx={{
          '& > div:first-of-type': {
            transitionProperty: 'width, background-color',
            transitionDuration: '0.2s',
            bg: useColorModeValue('blue.500', 'dracula.purple')
          }
        }}
      />
    </MotionBox>
  )
}

const Skills = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const technicalSkills = {
    "Front End Development": [
      { name: "React", icon: FaReact },
      { name: "JavaScript", icon: FaJs },
      { name: "HTML5", icon: FaHtml5 },
      { name: "CSS", icon: FaCss3Alt },
      { name: "SASS", icon: FaSass },
      { name: "TailwindCSS", icon: SiTailwindcss },
      { name: "Bootstrap", icon: SiBootstrap }
    ],
    "Back End Development": [
      { name: "Django", icon: SiDjango },
      { name: "Python", icon: FaPython },
      { name: "Java", icon: FaJava },
      { name: "Spring", icon: SiSpring },
      { name: "NodeJS", icon: FaNodeJs }
    ],
    "Project Management": [
      { name: "Agile Methodologies", icon: BsKanbanFill },
      { name: "Scrum", icon: FaTasks }
    ],
    "Databases": [
      { name: "MySQL", icon: SiMysql },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb }
    ],
    "BaaS": [
      { name: "Firebase", icon: SiFirebase },
      { name: "Supabase", icon: SiSupabase }
    ],
    "Systems": [
      { name: "Unix/Linux Administration", icon: FaLinux },
      { name: "Git", icon: FaGitAlt }
    ]
  }

  const technicalSkillsEs = {
    "Desarrollo Front End": [
      { name: "React", icon: FaReact },
      { name: "JavaScript", icon: FaJs },
      { name: "HTML5", icon: FaHtml5 },
      { name: "CSS", icon: FaCss3Alt },
      { name: "SASS", icon: FaSass },
      { name: "TailwindCSS", icon: SiTailwindcss },
      { name: "Bootstrap", icon: SiBootstrap }
    ],
    "Desarrollo Back End": [
      { name: "Django", icon: SiDjango },
      { name: "Python", icon: FaPython },
      { name: "Java", icon: FaJava },
      { name: "Spring", icon: SiSpring },
      { name: "NodeJS", icon: FaNodeJs }
    ],
    "Gestión de Proyectos": [
      { name: "Metodologías Ágiles", icon: BsKanbanFill },
      { name: "Scrum", icon: FaTasks }
    ],
    "Bases de Datos": [
      { name: "MySQL", icon: SiMysql },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb }
    ],
    "BaaS": [
      { name: "Firebase", icon: SiFirebase },
      { name: "Supabase", icon: SiSupabase }
    ],
    "Sistemas": [
      { name: "Administración Unix/Linux", icon: FaLinux },
      { name: "Git", icon: FaGitAlt }
    ]
  }

  const languages = [
    { 
      language: "Spanish", 
      languageEs: "Español", 
      level: "Native",
      levelEs: "Nativo" 
    },
    { 
      language: "English", 
      languageEs: "Inglés", 
      level: "Advanced",
      levelEs: "Avanzado" 
    },
    { 
      language: "Portuguese", 
      languageEs: "Portugués", 
      level: "Intermediate",
      levelEs: "Intermedio" 
    },
    { 
      language: "French", 
      languageEs: "Francés", 
      level: "Basic",
      levelEs: "Básico" 
    }
  ]

  const headingGradient = useColorModeValue(
    'linear(to-r, light.accent, light.accentDark)',
    'linear(to-r, dracula.purple, dracula.pink)'
  )

  const getLocalizedLanguageData = (item) => ({
    language: currentLanguage === 'es' ? item.languageEs : item.language,
    level: currentLanguage === 'es' ? item.levelEs : item.level
  })

  return (
    <Container maxW="container.lg" px={[4, 6, 8]}>
      <VStack spacing={10} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading 
            as="h2" 
            size="xl" 
            mb={8}
            bgGradient={headingGradient}
            bgClip="text"
            letterSpacing="tight"
          >
            {t('skills.technical')}
          </Heading>
          <Divider mb={8} opacity={0.3} />
          {Object.entries(currentLanguage === 'es' ? technicalSkillsEs : technicalSkills)
            .map(([category, skills], index) => (
              <SkillCategory 
                key={index} 
                title={category} 
                skills={skills} 
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
            mb={8}
            bgGradient={headingGradient}
            bgClip="text"
            letterSpacing="tight"
          >
            {t('skills.languages')}
          </Heading>
          <Divider mb={8} opacity={0.3} />
          <SimpleGrid columns={[1, 2]} spacing={6}>
            {languages.map((lang, index) => (
              <LanguageItem 
                key={index} 
                {...getLocalizedLanguageData(lang)} 
                delay={0.6 + index * 0.1}
              />
            ))}
          </SimpleGrid>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default Skills
