import { Server } from 'node:http'

import { MockProxy, mock } from 'vitest-mock-extended'

import { ExpressHttpServer } from "../http-server/express-http-server"
import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"

describe('Http Server with Express', () => {
  let controller: MockProxy<HttpController>
  let server: Server
  let httpServer = new ExpressHttpServer()

  beforeEach(() => {
    controller = mock<HttpController>()
    controller.handle.mockResolvedValue({ statusCode: 200, body: '' })
    httpServer = new ExpressHttpServer()
  })

  test('return not found if is listening and route does not exist', async () => {
    server = await httpServer.start(9999)
    const response = await fetch(`http://localhost:9999/any_route`)

    expect(response.status).toBe(404)

    server.close()
  })
  test('return controller response if is listening and route exists', async () => {
    httpServer.register(HTTP_VERBS.GET, '/any_route', controller)

    server = await httpServer.start(9999)
    const response = await fetch(`http://localhost:9999/any_route`)

    expect(response.status).toBe(200)

    server.close()
  })

  test('can forward query params to controller', async () => {
    httpServer.register(HTTP_VERBS.GET, '/any_route', controller)

    server = await httpServer.start(9999)
    await fetch(`http://localhost:9999/any_route?name=any_name`)

    expect(controller.handle)
      .toBeCalledWith(
        expect
          .objectContaining(
            { name: 'any_name' }
        )
      )

    server.close()
  })

  test('can forward named params to controller', async () => {
    httpServer.register(HTTP_VERBS.GET, '/any_route/:name', controller)

    server = await httpServer.start(9999)
    await fetch(`http://localhost:9999/any_route/any_name`)

    expect(controller.handle)
      .toBeCalledWith(
        expect
          .objectContaining(
            { name: 'any_name' }
        )
      )

    server.close()
  })

  test('can forward a body to controller through POST request', async () => {
    httpServer.register(HTTP_VERBS.POST, '/any_route', controller)

    server = await httpServer.start(9999)
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

    server.close()
  })
})