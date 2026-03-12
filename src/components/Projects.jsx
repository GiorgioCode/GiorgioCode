import { 
  Box, 
  Image, 
  Heading, 
  Text, 
  Button, 
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

const contactsIndex = projects.findIndex((p) => p.id === 'contacts');
const mainProjects = contactsIndex >= 0 ? projects.slice(0, contactsIndex) : projects;
const practicasGenerales = contactsIndex >= 0 ? projects.slice(contactsIndex) : [];

export default function Projects() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);

  const cardBg = useColorModeValue('white', 'dracula.bg');
  const cardHoverBg = useColorModeValue('gray.50', 'dracula.currentLine');
  const textColor = useColorModeValue('gray.800', 'dracula.foreground');
  const descriptionColor = useColorModeValue('gray.600', 'dracula.comment');
  const accentColor = useColorModeValue('gray.700', 'dracula.purple');
  const dateColor = useColorModeValue('gray.600', 'dracula.pink');
  const buttonBorderColor = useColorModeValue('gray.500', 'dracula.comment');

  const visitButtonHoverBg = useColorModeValue('gray.600', 'dracula.purple');
  const repoButtonHoverBg = useColorModeValue('gray.600', 'dracula.currentLine');
  const videoButtonHoverBg = useColorModeValue('gray.600', 'dracula.pink');

  return (
    <Box p={8} maxWidth='1200px' mx='auto'>
      <Heading 
        as='h2' 
        mb={6} 
        textAlign='left'
        color={textColor}
        fontSize={{ base: '2xl', md: '3xl' }}
        letterSpacing='tight'
        fontWeight='600'
      >
        {t('projects.title')}
      </Heading>

      <Box
        borderWidth='1px'
        borderRadius='xl'
        borderColor={buttonBorderColor}
        bg={useColorModeValue('white', 'transparent')}
        overflow='hidden'
      >
        {mainProjects.map((project, index) => (
          <Box
            key={project.id}
            bg={cardBg}
            _hover={{ bg: cardHoverBg }}
            transition='background-color 0.2s ease'
            borderTopWidth={index === 0 ? 0 : '1px'}
            borderColor={useColorModeValue('gray.200', 'dracula.currentLine')}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 5 }}
            cursor='pointer'
            onClick={() => {
              setSelectedProject(project)
              onOpen()
            }}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 3, md: 4 }}
              align={{ base: 'flex-start', md: 'flex-start' }}
            >
              <Box
                display={{ base: 'none', md: 'block' }}
                flexShrink={0}
              >
                <Image
                  src={project.image}
                  alt={t(`projects.${project.id}.title`)}
                  boxSize='72px'
                  objectFit='cover'
                  borderRadius='md'
                />
              </Box>

              <Box flex='1'>
                <Flex
                  justify='space-between'
                  align={{ base: 'flex-start', md: 'center' }}
                  gap={3}
                  mb={1}
                >
                  <Heading size='sm' color={accentColor}>
                    {t(`projects.${project.id}.title`)}
                  </Heading>
                  <Text
                    fontSize='xs'
                    color={dateColor}
                    whiteSpace={{ base: 'normal', md: 'nowrap' }}
                  >
                    {project.date && (
                      <>
                        {t(`projects.dates.${project.date.toLowerCase().split(' ')[0]}`)}{' '}
                        {project.date.split(' ')[1]}
                      </>
                    )}
                  </Text>
                </Flex>

                <Text
                  color={descriptionColor}
                  fontSize='sm'
                  mb={3}
                >
                  {t(`projects.${project.id}.description`)}
                </Text>

                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  justify='space-between'
                  gap={2}
                  align={{ base: 'stretch', sm: 'center' }}
                >
                  <Flex gap={2} wrap='wrap'>
                    {project.liveUrl && (
                      <Button
                        as='a'
                        href={project.liveUrl}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: visitButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('projects.visit')}
                      </Button>
                    )}

                    {project.repoUrl && (
                      <Button
                        as='a'
                        href={project.repoUrl}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: repoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.repoUrlBackend
                          ? t('projects.repositoryFrontend')
                          : (project.useRepositorioText ? t('projects.repository') : t('projects.code'))}
                      </Button>
                    )}
                    {project.repoUrlBackend && (
                      <Button
                        as='a'
                        href={project.repoUrlBackend}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: repoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('projects.repositoryBackend')}
                      </Button>
                    )}

                    {project.videoUrl && (
                      <Button
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: videoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProject(project)
                          onOpen()
                        }}
                      >
                        {t('projects.video')}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>

      {practicasGenerales.length > 0 && (
        <Box mt={10}>
          <Heading
            as='h3'
            size='md'
            color={textColor}
            fontWeight='600'
            mb={4}
          >
            {t('projects.generalPractices')}
          </Heading>
          <Box
            borderWidth='1px'
            borderRadius='lg'
            borderColor={buttonBorderColor}
            bg={useColorModeValue('white', 'transparent')}
            overflow='hidden'
          >
            {practicasGenerales.map((project, index) => (
              <Button
                key={project.id}
                variant='ghost'
                width='100%'
                height='auto'
                minH='48px'
                justifyContent='flex-start'
                px={4}
                py={3}
                borderRadius={0}
                borderTopWidth={index === 0 ? 0 : '1px'}
                borderColor={useColorModeValue('gray.200', 'dracula.currentLine')}
                color={accentColor}
                fontWeight='normal'
                _hover={{ bg: cardHoverBg }}
                onClick={() => {
                  setSelectedProject(project)
                  onOpen()
                }}
              >
                <Flex width='100%' justify='space-between' align='center' gap={3}>
                  <Text as='span' fontSize='sm' noOfLines={1}>
                    {t(`projects.${project.id}.title`)}
                  </Text>
                  {project.date && (
                    <Text as='span' fontSize='xs' color={dateColor} whiteSpace='nowrap'>
                      {t(`projects.dates.${project.date.toLowerCase().split(' ')[0]}`)} {project.date.split(' ')[1]}
                    </Text>
                  )}
                </Flex>
              </Button>
            ))}
          </Box>
        </Box>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setSelectedProject(null)
          onClose()
        }}
        size='4xl'
      >
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
          <ModalHeader color={textColor}>
            {selectedProject ? t(`projects.${selectedProject.id}.title`) : ''}
          </ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody pb={6}>
            {selectedProject && (
              <>
                <AspectRatio ratio={16 / 9} mb={4}>
                  <Image
                    src={selectedProject.image}
                    alt={t(`projects.${selectedProject.id}.title`)}
                    objectFit='cover'
                  />
                </AspectRatio>
                <Text color={descriptionColor} mb={4}>
                  {t(`projects.${selectedProject.id}.description`)}
                </Text>
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  justify='space-between'
                  gap={3}
                  align={{ base: 'stretch', sm: 'center' }}
                >
                  <Flex gap={2} wrap='wrap'>
                    {selectedProject.liveUrl && (
                      <Button
                        as='a'
                        href={selectedProject.liveUrl}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: visitButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                      >
                        {t('projects.visit')}
                      </Button>
                    )}
                    {selectedProject.repoUrl && (
                      <Button
                        as='a'
                        href={selectedProject.repoUrl}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: repoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                      >
                        {selectedProject.repoUrlBackend
                          ? t('projects.repositoryFrontend')
                          : (selectedProject.useRepositorioText ? t('projects.repository') : t('projects.code'))}
                      </Button>
                    )}
                    {selectedProject.repoUrlBackend && (
                      <Button
                        as='a'
                        href={selectedProject.repoUrlBackend}
                        target='_blank'
                        size='sm'
                        variant='outline'
                        borderColor={buttonBorderColor}
                        color={textColor}
                        _hover={{ bg: repoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                        transition='all 0.15s ease-in-out'
                      >
                        {t('projects.repositoryBackend')}
                      </Button>
                    )}
                  </Flex>
                  {selectedProject.videoUrl && (
                    <Button
                      as='a'
                      href={selectedProject.videoUrl}
                      target='_blank'
                      size='sm'
                      variant='outline'
                      borderColor={buttonBorderColor}
                      color={textColor}
                      _hover={{ bg: videoButtonHoverBg, color: 'white', transform: 'translateY(-1px)' }}
                      transition='all 0.15s ease-in-out'
                    >
                      {t('projects.video')}
                    </Button>
                  )}
                </Flex>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
