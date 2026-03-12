import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FaSun, FaMoon, FaBars } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({
    base: true,
    xl: false
  })

  const mobileButtonHoverBg = useColorModeValue('blackAlpha.06', 'whiteAlpha.08')
  const mobileButtonActiveBg = useColorModeValue('blackAlpha.10', 'whiteAlpha.12')
  const navBg = useColorModeValue('white', 'dracula.bg')
  const linkHoverColor = useColorModeValue('gray.700', 'gray.300')
  const linkActiveColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.800', 'dracula.foreground')
  const drawerTextColor = useColorModeValue('gray.800', 'dracula.foreground')
  const borderColor = useColorModeValue('gray.200', 'dracula.currentLine')

  return (
    <Box 
      as="nav"
      aria-label="Main navigation"
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="64px"
      zIndex={10}
      bg={navBg}
      borderBottomWidth="1px"
      borderColor={borderColor}
      px={4} 
      boxShadow="sm"
      transition="all 0.2s"
      display="flex"
      alignItems="center"
    >
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Box>
          {pathname !== '/' && (
            <Link
              as={RouterLink}
              to="/"
              color={textColor}
              fontSize="xl"
              fontWeight="600"
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor
              }}
              transition="color 0.2s"
            >
              Jorge Angel Paez
            </Link>
          )}
        </Box>

        {isMobile ? (
          <IconButton
            icon={<FaBars />}
            variant="ghost"
            color={textColor}
            aria-label="Open menu"
            onClick={onOpen}
            _hover={{ bg: mobileButtonHoverBg }}
            _active={{ bg: mobileButtonActiveBg }}
            transition="all 0.2s"
          />
        ) : (
          <Stack direction="row" spacing={4} align="center">
            <Link
              as={RouterLink}
              to="/"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.home')}
            </Link>
            <Link
              as={RouterLink}
              to="/experience"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.experience')}
            </Link>
            <Link
              as={RouterLink}
              to="/education"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.education')}
            </Link>
            <Link
              as={RouterLink}
              to="/skills"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.skills')}
            </Link>
            <Link
              as={RouterLink}
              to="/projects"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.projects')}
            </Link>
            <Link
              as={RouterLink}
              to="/contact"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.contact')}
            </Link>
            <Link
              as={RouterLink}
              to="/about"
              color={textColor}
              _hover={{ color: linkHoverColor }}
              _active={{ color: linkActiveColor }}
              transition="color 0.2s"
            >
              {t('navigation.about')}
            </Link>

            <LanguageSelector />

            <IconButton
              aria-label={colorMode === 'light' ? t('theme.dark') : t('theme.light')}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color={textColor}
              _hover={{ bg: mobileButtonHoverBg }}
              _active={{ bg: mobileButtonActiveBg }}
              transition="all 0.2s"
            />
          </Stack>
        )}

        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg={useColorModeValue('white', 'dracula.bg')}>
            <DrawerCloseButton color={drawerTextColor} />
            <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
              <Text color={drawerTextColor}>{t('navigation.menu')}</Text>
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch" mt={4}>
                <Link
                  as={RouterLink}
                  to="/"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.home')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/experience"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.experience')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/education"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.education')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/skills"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.skills')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/projects"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.projects')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/contact"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.contact')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/about"
                  color={drawerTextColor}
                  _hover={{ color: linkHoverColor }}
                  _active={{ color: linkActiveColor }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {t('navigation.about')}
                </Link>

                <Box alignSelf="center">
                  <LanguageSelector />
                </Box>

                <IconButton
                  aria-label={colorMode === 'light' ? t('theme.dark') : t('theme.light')}
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  color={drawerTextColor}
                  _hover={{ bg: mobileButtonHoverBg }}
                  _active={{ bg: mobileButtonActiveBg }}
                  transition="all 0.2s"
                  w="full"
                />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  )
}

export default Navbar
