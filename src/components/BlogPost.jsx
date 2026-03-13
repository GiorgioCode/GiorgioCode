import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Box,
  Spinner,
  Text,
  Button,
  useColorModeValue,
  Heading,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  chakra,
  Container,
  Flex,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useColorMode } from '@chakra-ui/react'
import ShareButtons from './ShareButtons'

const postFiles = import.meta.glob('../../preblog/*.md', { query: '?raw', import: 'default' })

const BlogPost = () => {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const { colorMode } = useColorMode()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const isoDate = slug
  let formattedDate = ''
  if (isoDate && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const d = new Date(isoDate)
    if (!Number.isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString(i18n.language || 'es', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
  }

  const meta = {
    author: 'Jorge Ángel Páez',
    date: formattedDate,
    isoDate,
  }

  const borderColor = useColorModeValue('gray.200', 'dracula.currentLine')
  const cardBg = useColorModeValue('white', 'dracula.bg')
  const textColor = useColorModeValue('gray.800', 'dracula.foreground')
  const metaColor = useColorModeValue('gray.500', 'dracula.comment')
  const linkColor = useColorModeValue('blue.600', 'dracula.purple')
  const blockquoteBorder = useColorModeValue('gray.300', 'dracula.currentLine')
  const blockquoteText = useColorModeValue('gray.600', 'dracula.comment')
  const tableHeadBg = useColorModeValue('gray.100', 'dracula.currentLine')
  const codeBg = useColorModeValue('gray.50', '#1e293b')
  const spinnerColor = useColorModeValue('gray.600', 'dracula.purple')

  useEffect(() => {
    const key = `../../preblog/${slug}.md`
    const loader = postFiles[key]
    if (loader) {
      loader()
        .then((text) => {
          setContent(text)
        })
        .finally(() => setLoading(false))
    } else {
      setContent(`# 404\n\n${t('blog.postNotFound')}`)
      setLoading(false)
    }
  }, [slug, t])

  if (loading) {
    return (
      <Flex justify="center" align="center" py={20}>
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    )
  }

  const syntaxStyle = colorMode === 'dark' ? oneDark : oneLight

  const mdComponents = {
    h1: ({ node, ...props }) => <Heading as="h1" size="xl" mt={8} mb={4} color={textColor} {...props} />,
    h2: ({ node, ...props }) => <Heading as="h2" size="lg" mt={6} mb={3} color={textColor} {...props} />,
    h3: ({ node, ...props }) => <Heading as="h3" size="md" mt={5} mb={2} color={textColor} {...props} />,
    p: ({ node, ...props }) => (
      <Text mb={4} lineHeight="tall" fontSize="md" color={textColor} {...props} />
    ),
    a: ({ node, ...props }) => (
      <Link color={linkColor} _hover={{ textDecoration: 'underline' }} isExternal={props.href?.startsWith('http')} {...props} />
    ),
    ul: ({ node, ...props }) => <UnorderedList ml={6} mb={4} spacing={1} {...props} />,
    ol: ({ node, ...props }) => <OrderedList ml={6} mb={4} spacing={1} {...props} />,
    li: ({ node, ordered, index, checked, ...props }) => <ListItem color={textColor} {...props} />,
    code: ({ node, className, children, inline, ...props }) => {
      const text = String(children).replace(/\n$/, '').trim()
      const isInline = !className
      const isAsciiDiagram = /^[-+|\s\w]*$/.test(text) && text.includes('|')
      if (isAsciiDiagram && !isInline) {
        const lines = text.split('\n')
        return (
          <Box overflowX="auto" mb={4} bg={codeBg} p={4} borderRadius="md" fontFamily="mono" fontSize="sm">
            <pre style={{ margin: 0 }}>{text}</pre>
          </Box>
        )
      }
      if (isInline) {
        return (
          <Code px={1.5} py={0.5} fontSize="0.9em" borderRadius="md" bg={codeBg} color={textColor} {...props}>
            {children}
          </Code>
        )
      }
      const match = /language-(\w+)/.exec(className || '')
      const lang = match ? match[1] : ''
      return (
        <Box mb={4} borderRadius="md" overflow="hidden" sx={{ '& pre': { margin: 0 } }}>
          <SyntaxHighlighter
            language={lang}
            style={syntaxStyle}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
            codeTagProps={{ style: { color: undefined } }}
          >
            {text}
          </SyntaxHighlighter>
        </Box>
      )
    },
    blockquote: ({ node, ...props }) => (
      <Box
        pl={4}
        borderLeftWidth="4px"
        borderLeftColor={blockquoteBorder}
        color={blockquoteText}
        mb={4}
        fontStyle="italic"
        {...props}
      />
    ),
    table: ({ node, ...props }) => (
      <Box overflowX="auto" mb={4}>
        <Table variant="simple" size="sm" colorScheme={colorMode === 'dark' ? 'whiteAlpha' : 'gray'} {...props} />
      </Box>
    ),
    thead: ({ node, ...props }) => <Thead bg={tableHeadBg} {...props} />,
    tbody: ({ node, ...props }) => <Tbody {...props} />,
    tr: ({ node, ...props }) => <Tr {...props} />,
    th: ({ node, ...props }) => <Th color={textColor} {...props} />,
    td: ({ node, ...props }) => <Td color={textColor} {...props} />,
    hr: ({ node, ...props }) => <Divider my={6} borderColor={borderColor} {...props} />,
    img: ({ node, ...props }) => (
      <Box my={6} display="flex" justifyContent="center" alignItems="center">
        <chakra.img maxW="100%" height="auto" borderRadius="md" alt="" display="block" {...props} />
      </Box>
    ),
  }

  return (
    <Container maxW="900px" px={0}>
      <Button
        mb={6}
        as={RouterLink}
        to="/blog"
        variant="ghost"
        size="sm"
        color={linkColor}
        _hover={{ textDecoration: 'underline' }}
      >
        ← {t('blog.backToBlog')}
      </Button>

      <Box p={{ base: 5, md: 8 }} borderWidth="1px" borderRadius="xl" borderColor={borderColor} bg={cardBg}>
        <Flex justify="space-between" align="flex-start" gap={4} flexWrap="wrap" mb={4}>
          <Box>
            {(meta.author || meta.date) && (
              <Text fontSize="sm" color={metaColor}>
                {meta.author}
                {meta.date && ` · ${meta.date}`}
              </Text>
            )}
          </Box>
          <ShareButtons
            url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''}
            title={content ? (content.match(/^#\s+(.*)/m) ? content.match(/^#\s+(.*)/m)[1].trim() : slug) : slug}
            size="md"
          />
        </Flex>
        {content ? (
          <Box sx={{ '& > *:first-of-type': { marginTop: 0 } }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {content}
            </ReactMarkdown>
          </Box>
        ) : (
          <Text color={textColor}>{t('blog.noContent')}</Text>
        )}
      </Box>
    </Container>
  )
}

export default BlogPost
