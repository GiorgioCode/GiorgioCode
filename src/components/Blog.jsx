import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  useColorModeValue,
  Container,
  Button,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ShareButtons from './ShareButtons'

const MotionBox = motion.create(Box)

const postFiles = import.meta.glob('../../preblog/*.md', { query: '?raw', import: 'default' })

const Blog = () => {
  const { t } = useTranslation()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const headingColor = useColorModeValue('gray.800', 'dracula.foreground')
  const cardBg = useColorModeValue('white', 'dracula.bg')
  const borderColor = useColorModeValue('gray.200', 'dracula.currentLine')
  const summaryColor = useColorModeValue('gray.600', 'dracula.comment')
  const linkColor = useColorModeValue('gray.800', 'dracula.foreground')
  const linkHoverColor = useColorModeValue('gray.600', 'dracula.purple')
  const buttonHoverBg = useColorModeValue('gray.100', 'dracula.currentLine')
  const spinnerColor = useColorModeValue('gray.600', 'dracula.purple')
  const hoverBorderColor = useColorModeValue('gray.300', 'dracula.purple')

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const entries = Object.entries(postFiles)
        const arr = await Promise.all(
          entries.map(async ([path, resolver]) => {
            const content = await resolver()
            const slugMatch = path.match(/\/([^/]+)\.md$/)
            const slug = slugMatch ? slugMatch[1] : ''
            const titleMatch = content.match(/^#\s+(.*)/m)
            const title = titleMatch ? titleMatch[1].trim() : slug
            const lines = content.split('\n')
            let paraCount = 0
            let current = ''
            const paras = []
            let started = false
            for (const line of lines) {
              if (!started) {
                if (line.startsWith('# ')) started = true
                continue
              }
              if (line.trim().startsWith('#')) continue
              if (line.trim() === '---') continue
              if (line.trim() === '') {
                if (current.trim() !== '') {
                  paras.push(current.trim())
                  paraCount++
                  current = ''
                  if (paraCount >= 2) break
                }
              } else {
                current += line + ' '
              }
            }
            if (current.trim() !== '' && paraCount < 2) paras.push(current.trim())
            const firstPara = paras[0] || ''
            let summary = ''
            const matchSentence = firstPara.match(/(.+?[.!?])(\s|$)/)
            if (matchSentence) {
              summary = matchSentence[1]
            } else {
              summary = firstPara.slice(0, 160)
              if (firstPara.length > 160) summary += '...'
            }
            const isoDate = slug
            let date = ''
            if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
              const d = new Date(isoDate)
              if (!Number.isNaN(d.getTime())) {
                date = d.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }
            }
            const author = 'Jorge Ángel Páez'
            return { slug, title, summary, isoDate, date, author }
          })
        )
        arr.sort((a, b) => {
          if (a.isoDate && b.isoDate) {
            return b.isoDate.localeCompare(a.isoDate)
          }
          return a.slug.localeCompare(b.slug)
        })
        setPosts(arr)
      } catch (err) {
        console.error('Error loading blog posts', err)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  if (loading) {
    return (
      <Flex justify="center" align="center" py={20}>
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    )
  }

  return (
    <Container maxW="1600px" px={0}>
      <Heading as="h1" size="xl" mb={8} color={headingColor} fontWeight="600">
        {t('blog.title')}
      </Heading>

      {posts.length === 0 ? (
        <Text color={summaryColor} fontSize="lg">
          {t('blog.noPosts')}
        </Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {posts.map((p, index) => (
            <MotionBox
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              borderColor={borderColor}
              bg={cardBg}
              _hover={{
                borderColor: hoverBorderColor,
                transition: 'border-color 0.2s',
              }}
            >
              <Link
                as={RouterLink}
                to={`/blog/${p.slug}`}
                _hover={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Heading as="h2" size="md" mb={2} color={linkColor} _hover={{ color: linkHoverColor }} transition="color 0.2s">
                  {p.title}
                </Heading>
              </Link>
              {(p.author || p.date) && (
                <Text fontSize="sm" color={summaryColor} mb={3}>
                  {p.author && <><strong>{t('blog.author')}:</strong> {p.author}</>}
                  {p.author && p.date && ' · '}
                  {p.date && <><strong>{t('blog.date')}:</strong> {p.date}</>}
                </Text>
              )}
              {p.summary && (
                <Text fontSize="md" color={summaryColor} lineHeight="tall" mb={4}>
                  {p.summary}
                </Text>
              )}
              <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
                <Button
                  as={RouterLink}
                  to={`/blog/${p.slug}`}
                  size="sm"
                  variant="outline"
                  borderColor={borderColor}
                  color={linkColor}
                  _hover={{ bg: buttonHoverBg, borderColor: linkHoverColor, color: linkHoverColor }}
                  transition="all 0.2s"
                >
                  {t('blog.readMore')}
                </Button>
                <ShareButtons
                  url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${p.slug}` : ''}
                  title={p.title}
                  size="sm"
                />
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      )}
    </Container>
  )
}

export default Blog
