import { useState } from 'react'
import {
  Flex,
  IconButton,
  useColorModeValue,
  useToast,
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from 'react-share'
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp, FaLink } from 'react-icons/fa'

const ShareButtons = ({ url, title, size = 'md' }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const iconColor = useColorModeValue('gray.700', 'dracula.foreground')
  const hoverBg = useColorModeValue('gray.100', 'dracula.currentLine')

  const iconSize = size === 'sm' ? 4 : 5
  const buttonSize = size === 'sm' ? 'sm' : 'md'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: t('blog.linkCopied'),
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: t('blog.copyError'),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  const shareProps = { url, title }
  const iconPx = size === 'sm' ? 14 : 18
  const boxStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size === 'sm' ? 8 : 10,
    height: size === 'sm' ? 8 : 10,
    borderRadius: 'full',
    color: iconColor,
    _hover: { bg: hoverBg },
    transition: 'background 0.2s',
  }

  return (
    <Flex gap={1} align="center" flexWrap="wrap">
      <TwitterShareButton {...shareProps}>
        <Tooltip label="Twitter / X" placement="top">
          <Flex as="span" {...boxStyle}>
            <FaTwitter size={iconPx} />
          </Flex>
        </Tooltip>
      </TwitterShareButton>
      <FacebookShareButton {...shareProps}>
        <Tooltip label="Facebook" placement="top">
          <Flex as="span" {...boxStyle}>
            <FaFacebookF size={iconPx} />
          </Flex>
        </Tooltip>
      </FacebookShareButton>
      <LinkedinShareButton {...shareProps}>
        <Tooltip label="LinkedIn" placement="top">
          <Flex as="span" {...boxStyle}>
            <FaLinkedinIn size={iconPx} />
          </Flex>
        </Tooltip>
      </LinkedinShareButton>
      <WhatsappShareButton {...shareProps}>
        <Tooltip label="WhatsApp" placement="top">
          <Flex as="span" {...boxStyle}>
            <FaWhatsapp size={iconPx} />
          </Flex>
        </Tooltip>
      </WhatsappShareButton>
      <Tooltip label={copied ? 'Copiado' : 'Copiar enlace'} placement="top">
        <IconButton
          aria-label="Copiar enlace"
          icon={<FaLink size={iconPx} />}
          onClick={handleCopyLink}
          size={buttonSize}
          variant="ghost"
          borderRadius="full"
          color={iconColor}
          _hover={{ bg: hoverBg }}
        />
      </Tooltip>
    </Flex>
  )
}

export default ShareButtons
