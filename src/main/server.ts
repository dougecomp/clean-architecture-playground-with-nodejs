import { makeFastifyApp } from "../frameworks-and-drivers/fastify"

(async () => {

  const fastify = makeFastifyApp()
  
  await fastify.listen({
    port: 3000,
    host: '0.0.0.0'
  })

  console.log('Server listening on port 3000');  

})()