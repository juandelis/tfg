const middleware = {}

middleware['autenticado'] = require('..\\middleware\\autenticado.js')
middleware['autenticado'] = middleware['autenticado'].default || middleware['autenticado']

export default middleware
