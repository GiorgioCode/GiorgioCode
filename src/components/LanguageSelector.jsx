import { Box, HStack, Switch, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
  const { i18n } = useTranslation()
  
  // Pre-compute all color mode values
  const switchBorderColor = useColorModeValue('blue.400', 'dracula.purple')
  const switchBgColor = useColorModeValue('gray.100', 'whiteAlpha.50')
  const switchTextColor = useColorModeValue('gray.800', 'dracula.foreground')
  const switchTrackBg = useColorModeValue('gray.300', 'dracula.currentLine')
  const switchThumbBg = useColorModeValue('white', 'dracula.foreground')
  const switchCheckedTrackBg = useColorModeValue('blue.400', 'dracula.purple')
  const switchColorScheme = useColorModeValue('blue', 'purple')

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <Box
      px={3}
      py={1}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={switchBorderColor}
      bg={switchBgColor}
    >
      <HStack spacing={2} align="center">
        <Text 
          fontSize="sm" 
          color={switchTextColor}
          fontWeight={i18n.language === 'es' ? 'bold' : 'normal'}
        >
          ES
        </Text>
        <Switch
          size="md"
          colorScheme={switchColorScheme}
          isChecked={i18n.language === 'en'}
          onChange={() => changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
          sx={{
            '& .chakra-switch__track': {
              bg: switchTrackBg
            },
            '& .chakra-switch__thumb': {
              bg: switchThumbBg
            },
            '&[data-checked] .chakra-switch__track': {
              bg: switchCheckedTrackBg
            }
          }}
        />
        <Text 
          fontSize="sm" 
          color={switchTextColor}
          fontWeight={i18n.language === 'en' ? 'bold' : 'normal'}
        >
          EN
        </Text>
      </HStack>
    </Box>
  )
}

export default LanguageSelector
