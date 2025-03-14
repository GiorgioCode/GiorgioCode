import { init } from '@emailjs/browser';

try {
  // Inicializa EmailJS con la Public Key desde variables de entorno
  init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  console.log('EmailJS initialized successfully');
} catch (error) {
  console.error('Error initializing EmailJS:', error);
}

// Configuración de EmailJS usando variables de entorno
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

// Validar que todas las variables de entorno estén definidas
if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
  console.error('Missing EmailJS configuration:', {
    serviceId: !!EMAILJS_CONFIG.serviceId,
    templateId: !!EMAILJS_CONFIG.templateId,
    publicKey: !!EMAILJS_CONFIG.publicKey
  });
}
