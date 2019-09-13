const Doc = require('discord.js-docs')
const router = require('express').Router()

const { notFound, badRequest } = require('./util')

router.use('/*', async (req, res, next) => {
  if (!req.query.src) badRequest(res, 'No source specified.')

  const force = req.query.force === 'true'
  try {
    const doc = await Doc.fetch(req.query.src, { force })
    res.locals.doc = doc
    next()
  } catch (err) {
    return notFound(res, 'Couldn\'t find/parse given source.')
  }
})

router.get('/', (req, res) => {
  const element = req.query.q
    ? res.locals.doc.get(...req.query.q.split(/[/#.]/g))
    : res.locals.doc

  if (!element) return notFound(res, 'Could not find element.')
  const response = req.query.raw === 'true' ? element.originalJSON : element.toJSON()
  return res.status(200).json(response)
})

router.get('/search', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No query specified.')

  const includePrivateElements = req.query.private === 'true'
  const results = res.locals.doc
    .search(req.query.q, { excludePrivateElements: !includePrivateElements })

  if (!results) res.status(200).json([])
  return res.status(200).json(results.map(result => result.toJSON()))
})

router.get('/embed', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No query specified.')

  const includePrivateElements = req.query.private === 'true'
  const embed = res.locals.doc
    .resolveEmbed(req.query.q, { excludePrivateElements: !includePrivateElements })

  return res.status(200).json(embed)
})

module.exports = router
