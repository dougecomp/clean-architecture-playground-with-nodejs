import { Server } from 'node:http';

import { MockProxy, mock } from "vitest-mock-extended";

import { Controller } from '../../interface-adapters/controllers/controller';
import { HTTP_VERBS } from '../../interface-adapters/http/helpers';
import { ExpressHttpServer } from "./express-http-server";
import { FastifyHttpServer } from "./fastify-http-server";
import { HapiHttpServer } from "./hapi-http-server";
import { HttpServer } from "./http-server";
import { UnauthorizedError } from '../../interface-adapters/errors/unathorized-error';
import { ServerError } from '../../interface-adapters/errors/server-error';

interface MakeRequesToInput {
  method?: HTTP_VERBS
  url: string
  body?: any
  headers?: any
}

async function makeHttpRequestTo({method = HTTP_VERBS.GET, url = '/' , body, headers = {}}: MakeRequesToInput) {
  return await fetch(url, {
    method,
    body,
    headers
  })
}

suite.sequential.each([
  [{serverName: 'Express Http Server', httpServer: ExpressHttpServer}],
  [{serverName: 'Fastify Http Server', httpServer: FastifyHttpServer}],
  [{serverName: 'Hapi Http Server', httpServer: HapiHttpServer}]
])('$serverName', ({ httpServer }) => {
  const HTTP_SERVER_PORT = 9999
  const HTTP_SERVER_BASE_URL = `http://localhost:${HTTP_SERVER_PORT}`
  let controller: MockProxy<Controller>
  let server: Server
  let sut: HttpServer
  
  beforeEach(() => {
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })
    sut = new httpServer()
  })

  afterEach(async () => {
    server.close()
    
    await new Promise(resolve => {
      server.on('close', () => {
        resolve(null)
      })
    })
  })

  test('return not found if is listening and route does not exist', async () => {
    server = await sut.start(HTTP_SERVER_PORT)
    
    const response = await makeHttpRequestTo({
      url: `${HTTP_SERVER_BASE_URL}/any_route`
    })

    expect(response.status).toBe(404)
  })

  suite('route registration through an controller', () => {
    
    test('return OK with data if is listening, route exists and controller no return error', async () => {
      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      const response = await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`
      })
  
      expect(response.status).toBe(200)
      expect(await response.json()).deep.equals({ any: 'data' })
    })

    test('return UNAUTHORIZED if is listening, route exists and controller return UnauthorizedError', async () => {
      controller.handle.mockResolvedValue({ error: new UnauthorizedError() })

      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      const response = await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`
      })
  
      expect(response.status).toBe(401)
    })

    test('return BAD_REQUEST if is listening, route exists and controller return Error', async () => {
      controller.handle.mockResolvedValue({ error: new Error() })

      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      const response = await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`
      })
  
      expect(response.status).toBe(400)
    })

    test('return SERVER_ERROR if is listening, route exists and controller return Server Error', async () => {
      controller.handle.mockResolvedValue({ error: new ServerError() })

      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      const response = await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`
      })
  
      expect(response.status).toBe(500)
    })
  
    test('can forward query params to controller', async () => {
      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route?name=any_name`
      })
  
      expect(controller.handle)
        .toBeCalledWith(
          expect
            .objectContaining(
              { name: 'any_name' }
          )
        )
    })
  
    test('can forward named params to controller', async () => {
      sut.registerController({
        method: HTTP_VERBS.GET,
        route: '/any_route/:{name}',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route/any_name`
      })
  
      expect(controller.handle)
        .toBeCalledWith(
          expect
            .objectContaining(
              { name: 'any_name' }
          )
        )
    })
  
    test('can forward a body to controller through POST request', async () => {
      sut.registerController({
        method: HTTP_VERBS.POST,
        route: '/any_route',
        controller
      })  
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`,
        method: HTTP_VERBS.POST,
        body: JSON.stringify({ name: 'any_name' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      expect(controller.handle)
        .toBeCalledWith(
          expect
            .objectContaining(
              { name: 'any_name' }
          )
        )
    })
  })
})