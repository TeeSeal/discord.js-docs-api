
const app = require('express')()
const port = process.env.PORT || 4000

const { notFound } = require('./util')
const v1 = require('./v1')
const v2 = require('./v2')

app.use(require('morgan')(':remote-addr :method :url :status - :response-time ms'))
app.disable('etag')

app.use('/v1', v1)
app.use('/v2', v2)
app.get('*', (_, res) => notFound(res))

app.listen(port, () => console.log(`Listening on port ${port}.`))
