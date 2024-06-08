import Fastify, { FastifyInstance } from "fastify"
import cors from '@fastify/cors'

import { HttpServer } from "./http-server"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"

export class FastifyHttpServer implements HttpServer {
  private httpServer: FastifyInstance

  constructor () {
    this.httpServer = Fastify({
      logger: true
    })

    this.setupMiddlewares()
  }

  private setupMiddlewares () {
    this.httpServer.register(cors)
  }

  async register (method: string, route: string, httpController: HttpController): Promise<void> {
    this.httpServer.route({
      method: method as any,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const httpResponse = await httpController.handle({
          ...req.body as any,
          ...req.params as any,
          ...req.headers as any
        })

        res
        .status(httpResponse.statusCode)
        .send(httpResponse.body)
      }
    })
  }

  async start (port: number): Promise<void> {
    await this.httpServer.listen({
      port
    })
  }
}