import Fastify from 'fastify'

export function makeFastifyApp () {
  const fastify = Fastify({
    logger: true
  })
  
  fastify.get('/', async (req, res) => {
    res
    .status(200)
    .send('Hello World!')
  })

  return fastify
}