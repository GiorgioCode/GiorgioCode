import { extendTheme } from '@chakra-ui/react'

// Paleta sobria y profesional: tonos slate, navy y un acento discreto
const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html, body': {
        bg: props.colorMode === 'dark'
          ? '#0f1219'
          : '#f1f5f9',
        color: props.colorMode === 'dark' ? '#e2e8f0' : '#1e293b',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
      },
      '*::selection': {
        bg: props.colorMode === 'dark' ? '#334155' : '#cbd5e1',
        color: props.colorMode === 'dark' ? '#f1f5f9' : '#0f172a',
      },
    }),
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    // Dark mode: charcoal/slate (reemplaza Dracula por algo más serio)
    dracula: {
      bg: '#0f1219',
      currentLine: '#1e293b',
      foreground: '#e2e8f0',
      comment: '#64748b',
      purple: '#94a3b8',
      pink: '#64748b',
      red: '#94a3b8',
      orange: '#94a3b8',
      yellow: '#94a3b8',
      green: '#94a3b8',
      cyan: '#94a3b8',
    },
    blue: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    light: {
      bg: '#f1f5f9',
      card: '#ffffff',
      border: '#e2e8f0',
      text: '#1e293b',
      subtext: '#475569',
      accent: '#475569',
      accentDark: '#334155',
      hover: '#f1f5f9',
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? '#334155' : 'light.accent',
          color: props.colorMode === 'dark' ? '#f1f5f9' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? '#475569' : 'light.accentDark',
            transform: 'translateY(-1px)',
            boxShadow: 'sm',
          },
        }),
        ghost: (props) => ({
          _hover: {
            bg: props.colorMode === 'dark' ? '#1e293b' : 'light.hover',
            transform: 'translateY(-1px)',
            boxShadow: 'sm',
          },
        }),
        outline: (props) => ({
          borderColor: props.colorMode === 'dark' ? '#475569' : 'light.accent',
          color: props.colorMode === 'dark' ? '#e2e8f0' : 'light.text',
          _hover: {
            bg: props.colorMode === 'dark' ? '#334155' : 'light.accent',
            color: props.colorMode === 'dark' ? '#f1f5f9' : 'white',
            transform: 'translateY(-1px)',
            boxShadow: 'sm',
          },
        }),
      },
    },
    Link: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? '#94a3b8' : 'light.accent',
        _hover: {
          color: props.colorMode === 'dark' ? '#cbd5e1' : 'light.accentDark',
          textDecoration: 'none',
        },
        _focus: {
          boxShadow: 'none',
        },
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? '#f1f5f9' : 'gray.800',
        fontWeight: '600',
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? '#e2e8f0' : 'gray.700',
      }),
    },
  },
  gradients: {
    draculaText: 'linear(to-r, #94a3b8, #64748b)',
    draculaBg: 'linear(to-b, #0f1219, #1e293b)',
    lightBg: 'linear(to-b, #f1f5f9, #e2e8f0)',
  },
})

export default theme
