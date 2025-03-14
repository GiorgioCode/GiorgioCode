import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Container,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

const MotionBox = motion(Box);

const Contact = () => {
  const { t } = useTranslation();
  const form = useRef();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const borderColor = useColorModeValue('light.border', 'dracula.currentLine');
  const textColor = useColorModeValue('light.text', 'dracula.foreground');
  const cardBg = useColorModeValue('light.card', 'dracula.bg');
  const buttonBg = useColorModeValue('light.accent', 'dracula.purple');
  const buttonHoverBg = useColorModeValue('light.accentDark', 'dracula.pink');
  const inputBg = useColorModeValue('white', 'dracula.currentLine');
  const headingGradient = useColorModeValue(
    'linear(to-r, light.accent, light.accentDark)',
    'linear(to-r, dracula.purple, dracula.pink)'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting to send email with config:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        hasPublicKey: !!EMAILJS_CONFIG.publicKey
      });

      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        form.current,
        EMAILJS_CONFIG.publicKey
      );

      toast({
        title: t('contact.success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      form.current.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: t('contact.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading
            as="h2"
            size="xl"
            mb={6}
            bgGradient={headingGradient}
            bgClip="text"
          >
            {t('contact.title')}
          </Heading>
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
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            transition: 'all 0.2s',
          }}
        >
          <form ref={form} onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>{t('contact.name')}</FormLabel>
                <Input
                  name="from_name"
                  placeholder={t('contact.placeholder.name')}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: buttonBg }}
                  _focus={{ borderColor: buttonBg, boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>{t('contact.email')}</FormLabel>
                <Input
                  name="from_email"
                  type="email"
                  placeholder={t('contact.placeholder.email')}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: buttonBg }}
                  _focus={{ borderColor: buttonBg, boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>{t('contact.message')}</FormLabel>
                <Textarea
                  name="message"
                  placeholder={t('contact.placeholder.message')}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: buttonBg }}
                  _focus={{ borderColor: buttonBg, boxShadow: 'none' }}
                  minH="200px"
                  resize="vertical"
                />
              </FormControl>

              <Button
                type="submit"
                bg={buttonBg}
                color="white"
                _hover={{ bg: buttonHoverBg }}
                _active={{ bg: buttonHoverBg }}
                isLoading={isSubmitting}
                loadingText={t('contact.send')}
                w="full"
                mt={4}
              >
                {t('contact.send')}
              </Button>
            </VStack>
          </form>
        </MotionBox>
      </VStack>
    </Container>
  );
};

export default Contact;
