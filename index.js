const Doc = require('discord.js-docs')
const app = require('express')()
const port = process.env.PORT || 4000

app.use(require('morgan')(':remote-addr :method :url :status - :response-time ms'))
app.disable('etag')

function error (res, name, message) {
  const json = { status: res.statusCode, error: name }
  if (message) json.message = message
  res.json(json)
}

function notFound (res, message) {
  res.status(404)
  return error(res, 'Not Found', message)
}

function badRequest (res, message) {
  res.status(400)
  return error(res, 'Bad Request', message)
}

app.use('/:project/:branch', async (req, res, next) => {
  const force = Boolean(req.query.force)
  const doc = await Doc.fetch(req.params.project, req.params.branch, { force })
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

  const response = req.query.raw ? element.originalJSON : element.toJSON()
  return res.status(200).json(response)
}

app.get('/:project/:branch', fetchElement)
app.get('/:project/:branch/el/:parent', fetchElement)
app.get('/:project/:branch/el/:parent/:child', fetchElement)

app.get('/:project/:branch/search', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No search query specified.')
  const results = res.locals.doc.search(req.query.q)
  if (!results) res.status(200).json([])
  return res.status(200).json(results.map(result => result.toJSON()))
})

app.get('/:project/:branch/embed', (req, res) => {
  if (!req.query.q) return badRequest(res, 'No search query specified.')
  const embed = res.locals.doc.resolveEmbed(req.query.q)
  return res.status(200).json(embed)
})

app.get('*', (req, res) => notFound(res))

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
