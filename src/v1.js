const Doc = require('discord.js-docs')
const router = require('express').Router()

const { notFound, badRequest } = require('./util')

router.use('/:project/:branch', async (req, res, next) => {
  const force = req.query.force === 'true'

  const sourceName = {
    'main/stable': 'stable',
    'main/master': 'master',
    'commando/master': 'commando',
    'rpc/master': 'rpc'
  }[`${req.params.project}/${req.params.branch}`]

  const doc = await Doc.fetch(sourceName, { force })
  if (!doc) return notFound(res, 'Couldn\'t find docs under that project/branch.')
  res.locals.doc = doc
  next()
})

function fetchElement (req, res) {
  let element
  if (req.params.parent) {
    element = res.locals.doc.get(req.params.parent, req.params.child)
    if (!element) return notFound(res, 'No such element.')
  } else {
    element = res.locals.doc
  }

  const response = req.query.raw === 'true' ? element.originalJSON : element.toJSON()
  return res.status(200).json(response)
}

router.get('/:project/:branch', fetchElement)
router.get('/:project/:branch/el/:parent', fetchElement)
router.get('/:project/:branch/el/:parent/:child', fetchElement)

router.get('/:project/:branch/search', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No search query specified.')
  const results = res.locals.doc.search(req.query.q)
  if (!results) res.status(200).json([])
  return res.status(200).json(results.map(result => result.toJSON()))
})

router.get('/:project/:branch/embed', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No search query specified.')
  const embed = res.locals.doc.resolveEmbed(req.query.q)
  return res.status(200).json(embed)
})

module.exports = router
