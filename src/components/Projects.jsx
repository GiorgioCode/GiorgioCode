import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Heading, 
  Text, 
  Button, 
  ButtonGroup, 
  Flex, 
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
  useDisclosure
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import projects from '../data/projects';

export default function Projects() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Dracula theme colors
  const cardBg = useColorModeValue('white', '#282a36');
  const cardHoverBg = useColorModeValue('gray.50', '#44475a');
  const textColor = useColorModeValue('gray.800', '#f8f8f2');
  const descriptionColor = useColorModeValue('gray.600', '#6272a4');
  const accentColor = useColorModeValue('blue.500', '#bd93f9');
  const dateColor = useColorModeValue('blue.600', '#ff79c6');
  const buttonBorderColor = useColorModeValue('blue.500', '#6272a4');
  
  // Button hover colors
  const visitButtonHoverBg = useColorModeValue('blue.500', '#bd93f9');
  const repoButtonHoverBg = useColorModeValue('pink.500', '#ff79c6');
  const videoButtonHoverBg = useColorModeValue('red.500', '#ff5555');

  return (
    <Box p={8} maxWidth='1400px' mx='auto'>
      <Heading 
        as='h2' 
        mb={8} 
        textAlign='center'
        bgGradient={useColorModeValue(
          'linear(to-r, blue.500, blue.600)',
          'linear(to-r, #bd93f9, #ff79c6)'
        )}
        bgClip='text'
        fontSize={{ base: '2xl', md: '3xl' }}
        letterSpacing='wide'
        fontWeight='bold'
        transition='all 0.2s ease-in-out'
        _hover={{ 
          textShadow: useColorModeValue(
            '0 0 8px rgba(49, 130, 206, 0.4)',
            '0 0 8px rgba(189, 147, 249, 0.4)'
          )
        }}
      >
        {t('projects.title')}
      </Heading>
      <SimpleGrid columns={[1, null, 2, 3]} spacing={8}>
        {projects.map((project) => (
          <Card 
            key={project.id} 
            bg={cardBg} 
            color={textColor}
            borderRadius='xl'
            overflow='hidden'
            _hover={{ 
              transform: 'translateY(-4px)', 
              boxShadow: useColorModeValue(
                '0 20px 25px -5px rgba(49, 130, 206, 0.1), 0 10px 10px -5px rgba(49, 130, 206, 0.04)',
                '0 20px 25px -5px rgba(189, 147, 249, 0.1), 0 10px 10px -5px rgba(189, 147, 249, 0.04)'
              ),
              bg: cardHoverBg
            }} 
            transition='all 0.3s ease-in-out'
            boxShadow={useColorModeValue(
              '0 4px 6px -1px rgba(49, 130, 206, 0.1), 0 2px 4px -1px rgba(49, 130, 206, 0.06)',
              '0 4px 6px -1px rgba(189, 147, 249, 0.1), 0 2px 4px -1px rgba(189, 147, 249, 0.06)'
            )}
          >
            <Image 
              src={project.image} 
              alt={t(`projects.${project.id}.title`)} 
              height='220px'
              objectFit='cover'
              transition='transform 0.3s ease-in-out'
              _hover={{ transform: 'scale(1.05)' }}
            />
            <CardBody p={6}>
              <Heading size='md' mb={2} color={accentColor}>
                {t(`projects.${project.id}.title`)}
              </Heading>
              <Text color={descriptionColor} minHeight='3rem'>
                {t(`projects.${project.id}.description`)}
              </Text>
              <Text mt={3} fontSize='sm' color={dateColor} fontWeight='medium'>
                {t(`projects.dates.${project.date.toLowerCase().split(' ')[0]}`)} {project.date.split(' ')[1]}
              </Text>
            </CardBody>
            <CardFooter px={6} pb={6} pt={0}>
              <Flex width='100%' direction='column' gap={2}>
                <ButtonGroup spacing={2} width='100%'>
                  {project.liveUrl && (
                    <Button 
                      as='a' 
                      href={project.liveUrl} 
                      target='_blank' 
                      variant='outline' 
                      flex={1}
                      borderColor={buttonBorderColor}
                      color={textColor}
                      _hover={{ bg: visitButtonHoverBg, color: '#f8f8f2', transform: 'translateY(-2px)' }}
                      transition='all 0.2s ease-in-out'
                    >
                      {t('projects.visit')}
                    </Button>
                  )}
                  <Button 
                    as='a' 
                    href={project.repoUrl} 
                    target='_blank' 
                    variant='outline' 
                    flex={1}
                    borderColor={buttonBorderColor}
                    color={textColor}
                    _hover={{ bg: repoButtonHoverBg, color: '#f8f8f2', transform: 'translateY(-2px)' }}
                    transition='all 0.2s ease-in-out'
                  >
                    {project.useRepositorioText ? t('projects.repository') : t('projects.code')}
                  </Button>
                </ButtonGroup>
                {project.videoUrl && (
                  <Button 
                    onClick={() => {
                      setSelectedVideo(project.videoUrl);
                      onOpen();
                    }}
                    variant='outline' 
                    width='100%'
                    borderColor={buttonBorderColor}
                    color={textColor}
                    _hover={{ bg: videoButtonHoverBg, color: '#f8f8f2', transform: 'translateY(-2px)' }}
                    transition='all 0.2s ease-in-out'
                  >
                    {t('projects.video')}
                  </Button>
                )}
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size='4xl'>
        <ModalOverlay 
          bg='blackAlpha.700'
          backdropFilter='blur(10px)'
        />
        <ModalContent 
          bg={cardBg}
          borderRadius='xl'
          overflow='hidden'
          boxShadow='dark-lg'
        >
          <ModalHeader color={textColor}>{t('projects.video')}</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody pb={6}>
            {selectedVideo && (
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={selectedVideo.replace('watch?v=', 'embed/')}
                  title='YouTube video player'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </AspectRatio>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
