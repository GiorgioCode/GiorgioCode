import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html, body': {
        bgGradient: props.colorMode === 'dark' 
          ? 'linear(to-br, #282a36, #44475a)'
          : 'linear(to-br, blue.300, blue.100, white)',
        color: props.colorMode === 'dark' ? '#f8f8f2' : '#2d3748',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        transition: 'all 0.2s ease-in-out',
      },
      '*::selection': {
        bg: props.colorMode === 'dark' ? '#bd93f9' : 'blue.200',
        color: props.colorMode === 'dark' ? '#f8f8f2' : 'gray.800',
      },
    }),
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    dracula: {
      bg: '#282a36',
      currentLine: '#44475a',
      foreground: '#f8f8f2',
      comment: '#6272a4',
      purple: '#bd93f9',
      pink: '#ff79c6',
      red: '#ff5555',
      orange: '#ffb86c',
      yellow: '#f1fa8c',
      green: '#50fa7b',
      cyan: '#8be9fd',
    },
    blue: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#2c5282',
      800: '#2a4365',
      900: '#1A365D',
    },
    light: {
      bg: '#dce6f3',
      card: '#ffffff',
      border: '#e2e8f0',
      text: '#2d3748',
      subtext: '#4a5568',
      accent: '#3182ce',
      accentDark: '#2b6cb0',
      hover: '#ebf8ff'
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
          bg: props.colorMode === 'dark' ? '#bd93f9' : 'light.accent',
          color: props.colorMode === 'dark' ? '#f8f8f2' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? '#ff79c6' : 'light.accentDark',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        }),
        ghost: (props) => ({
          _hover: {
            bg: props.colorMode === 'dark' ? '#44475a' : 'light.hover',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
        }),
        outline: (props) => ({
          borderColor: props.colorMode === 'dark' ? '#6272a4' : 'light.accent',
          color: props.colorMode === 'dark' ? '#f8f8f2' : 'light.text',
          _hover: {
            bg: props.colorMode === 'dark' ? '#bd93f9' : 'light.accent',
            color: props.colorMode === 'dark' ? '#f8f8f2' : 'white',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        }),
      },
    },
    Link: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'dracula.purple' : 'light.accent',
        _hover: {
          color: props.colorMode === 'dark' ? 'dracula.pink' : 'light.accentDark',
          textDecoration: 'none',
        },
        _focus: {
          boxShadow: 'none',
        },
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'dracula.foreground' : 'gray.700',
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'dracula.foreground' : 'gray.700',
      }),
    },
  },
  gradients: {
    draculaText: 'linear(to-r, #bd93f9, #ff79c6)',
    draculaBg: 'linear(to-br, #282a36, #44475a)',
    lightBg: 'linear(to-br, blue.300, blue.100, white)',
  },
})

export default theme
