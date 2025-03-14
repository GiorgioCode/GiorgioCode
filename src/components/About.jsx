import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Divider,
  Badge,
  Flex,
  Link
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaReact, FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiChakraui, SiFramer, SiI18Next } from 'react-icons/si';
import { MdCheckCircle } from 'react-icons/md';

export default function About() {
  const { t } = useTranslation();
  
  // Dracula theme colors
  const cardBg = useColorModeValue('white', '#282a36');
  const cardHoverBg = useColorModeValue('gray.50', '#44475a');
  const textColor = useColorModeValue('gray.800', '#f8f8f2');
  const accentColor = useColorModeValue('blue.500', '#bd93f9');
  const secondaryColor = useColorModeValue('blue.600', '#ff79c6');
  const commentColor = useColorModeValue('gray.600', '#6272a4');

  const technologies = [
    {
      name: 'React',
      icon: FaReact,
      description: t('about.technologies.react'),
      features: [
        'React Router',
        'React Icons',
        'React Hooks',
        'Context API'
      ]
    },
    {
      name: 'Chakra UI',
      icon: SiChakraui,
      description: t('about.technologies.chakra'),
      features: [
        t('about.features.responsive'),
        t('about.features.theme'),
        t('about.features.components'),
        t('about.features.hooks')
      ]
    },
    {
      name: 'Framer Motion',
      icon: SiFramer,
      description: t('about.technologies.framer'),
      features: [
        t('about.features.animations'),
        t('about.features.gestures'),
        t('about.features.transitions'),
        t('about.features.variants')
      ]
    },
    {
      name: 'i18next',
      icon: SiI18Next,
      description: t('about.technologies.i18next'),
      features: [
        t('about.features.translation'),
        t('about.features.languages'),
        t('about.features.namespaces'),
        t('about.features.fallback')
      ]
    },
    {
      name: 'EmailJS',
      icon: FaEnvelope,
      description: t('about.technologies.emailjs'),
      features: [
        t('about.features.email'),
        t('about.features.templates'),
        t('about.features.clientside'),
        t('about.features.customization')
      ]
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      description: t('about.technologies.github'),
      features: [
        t('about.features.version'),
        t('about.features.deployment'),
        t('about.features.collaboration'),
        t('about.features.hosting')
      ]
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading
            as="h1"
            mb={4}
            bgGradient={useColorModeValue(
              'linear(to-r, blue.500, blue.600)',
              'linear(to-r, #bd93f9, #ff79c6)'
            )}
            bgClip="text"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
          >
            {t('about.title')}
          </Heading>
          <Text color={commentColor} fontSize="lg" maxW="800px" mx="auto">
            {t('about.description')}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mt={8}>
          {technologies.map((tech) => (
            <Card
              key={tech.name}
              bg={cardBg}
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
                bg: cardHoverBg
              }}
              transition="all 0.3s"
              overflow="hidden"
            >
              <CardBody>
                <VStack spacing={4} align="flex-start">
                  <Flex align="center" width="100%">
                    <Icon
                      as={tech.icon}
                      boxSize={8}
                      color={accentColor}
                      mr={3}
                    />
                    <Heading size="md" color={textColor}>
                      {tech.name}
                    </Heading>
                  </Flex>
                  <Text color={commentColor}>{tech.description}</Text>
                  <Divider />
                  <List spacing={2} width="100%">
                    {tech.features.map((feature) => (
                      <ListItem key={feature} color={textColor}>
                        <ListIcon as={MdCheckCircle} color={secondaryColor} />
                        {feature}
                      </ListItem>
                    ))}
                  </List>

                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box mt={12} textAlign="center">
          <Text color={commentColor} fontSize="sm">
            {t('about.footer.text')}{' '}
            <Link
              href="https://github.com/GiorgioCode/GiorgioCode"
              color={accentColor}
              _hover={{ color: secondaryColor }}
              isExternal
            >
              GitHub
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
