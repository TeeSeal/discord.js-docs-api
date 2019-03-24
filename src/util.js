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

module.exports = { error, notFound, badRequest }
