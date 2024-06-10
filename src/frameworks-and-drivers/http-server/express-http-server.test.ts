import { Server } from 'node:http'

import { MockProxy, mock } from 'vitest-mock-extended'

import { ExpressHttpServer } from "../http-server/express-http-server"
import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"
import { HttpCallback } from './http-server'
import { Mock } from 'vitest'

describe('Http Server with Express', () => {
  let controller: MockProxy<HttpController>
  let server: Server
  let sut: ExpressHttpServer

  beforeEach(() => {
    controller = mock<HttpController>()
    controller.handle.mockResolvedValue({ statusCode: 200, body: '' })
    sut = new ExpressHttpServer()
  })

  afterEach(() => {
    server.close()
  })

  test('return not found if is listening and route does not exist', async () => {
    server = await sut.start(9999)
    const response = await fetch(`http://localhost:9999/any_route`)

    expect(response.status).toBe(404)
  })

  describe('route registration through an controller', () => {
    
    test('return controller response if is listening and route exists', async () => {
      sut.registerController(HTTP_VERBS.GET, '/any_route', controller)
  
      server = await sut.start(9999)
      const response = await fetch(`http://localhost:9999/any_route`)
  
      expect(response.status).toBe(200)
    })
  
    test('can forward query params to controller', async () => {
      sut.registerController(HTTP_VERBS.GET, '/any_route', controller)
  
      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route?name=any_name`)
  
      expect(controller.handle)
        .toBeCalledWith(
          expect
            .objectContaining(
              { name: 'any_name' }
          )
        )
    })
  
    test('can forward named params to controller', async () => {
      sut.registerController(HTTP_VERBS.GET, '/any_route/:name', controller)
  
      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route/any_name`)
  
      expect(controller.handle)
        .toBeCalledWith(
          expect
            .objectContaining(
              { name: 'any_name' }
          )
        )
    })
  
    test('can forward a body to controller through POST request', async () => {
      sut.registerController(HTTP_VERBS.POST, '/any_route', controller)
  
      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route`, {
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

  describe('route registration through a callback', () => {
    let callback: Mock

    beforeEach(() => {
      callback = vi.fn()
      callback.mockResolvedValue({ statusCode: 200, body: '' })
    })

    test('return callback response if is listening and route exists', async () => {
      sut.registerCallback(HTTP_VERBS.GET, '/any_route', callback)

      server = await sut.start(9999)
      const response = await fetch(`http://localhost:9999/any_route`)
  
      expect(response.status).toBe(200)
    })
    
    test('can forward query params to callback', async () => {
      sut.registerCallback(HTTP_VERBS.GET, '/any_route', callback)

      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route?name=any_name`)
  
      expect(callback)
        .toBeCalledWith(
          {},
          {},
          { name: 'any_name' },
          expect.anything()
        )
    })

    test('can forward named params to callback', async () => {
      sut.registerCallback(HTTP_VERBS.GET, '/any_route/:name', callback)

      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route/any_name`)
  
      expect(callback)
        .toBeCalledWith(
          {},
          { name: 'any_name' },
          {},
          expect.anything()
        )
    })

    test('can forward a body to callback through POST request', async () => {
      sut.registerCallback(HTTP_VERBS.POST, '/any_route', callback)

      server = await sut.start(9999)
      await fetch(`http://localhost:9999/any_route`, {
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