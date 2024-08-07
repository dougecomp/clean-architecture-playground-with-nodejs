import { Server } from 'node:http'

import { MockProxy, mock } from "vitest-mock-extended";
import { Mock } from 'vitest';

import { HttpController } from "../../interface-adapters/controllers/http/http-controller";
import { HTTP_VERBS } from '../../interface-adapters/controllers/http/helpers';
import { HttpServer } from "./http-server";
import { ExpressHttpServer } from "./express-http-server";
import { FastifyHttpServer } from "./fastify-http-server";
import { HapiHttpServer } from "./hapi-http-server";

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
  let controller: MockProxy<HttpController>
  let server: Server
  let sut: HttpServer
  
  beforeEach(() => {
    controller = mock<HttpController>()
    controller.handle.mockResolvedValue({ statusCode: 200, body: '' })
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
    
    test('return controller response if is listening and route exists', async () => {
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

  suite('route registration through a callback', () => {
    let callback: Mock

    beforeEach(() => {
      callback = vi.fn()
      callback.mockResolvedValue({ statusCode: 200, body: '' })
    })

    test('return callback response if is listening and route exists', async () => {
      sut.registerCallback({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        callback: callback
      })
      server = await sut.start(HTTP_SERVER_PORT)

      const response = await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`
      })
  
      expect(response.status).toBe(200)
    })
    
    test('can forward query params to callback', async () => {
      sut.registerCallback({
        method: HTTP_VERBS.GET,
        route: '/any_route',
        callback: callback
      })
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route?name=any_name`
      })
  
      expect(callback)
        .toBeCalledWith(
          {},
          {},
          { name: 'any_name' },
          expect.anything()
        )
    })

    test('can forward named params to callback', async () => {
      sut.registerCallback({
        method: HTTP_VERBS.GET,
        route: '/any_route/:{name}',
        callback: callback
      })
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route/any_name`
      })
  
      expect(callback)
        .toBeCalledWith(
          {},
          { name: 'any_name' },
          {},
          expect.anything()
        )
    })

    test('can forward a body to callback through POST request', async () => {
      sut.registerCallback({
        method: HTTP_VERBS.POST,
        route: '/any_route',
        callback: callback
      })
      server = await sut.start(HTTP_SERVER_PORT)

      await makeHttpRequestTo({
        url: `${HTTP_SERVER_BASE_URL}/any_route`,
        method: HTTP_VERBS.POST,
        body: JSON.stringify({ name: 'any_name' }),
        headers: { 'Content-Type': 'application/json' }
      })
  
      expect(callback)
        .toBeCalledWith(
          { name: 'any_name' },
          {},
          {},
          expect.anything()
        )
    })
  })
})