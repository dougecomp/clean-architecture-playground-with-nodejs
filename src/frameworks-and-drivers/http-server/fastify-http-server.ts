import { Server } from 'node:http'

import Fastify, { FastifyInstance } from "fastify"
import cors from '@fastify/cors'

import { HttpServer, RegisterCallbackInput, RegisterControllerInput } from "./http-server"

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

  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const httpResponse = await controller.handle({
          ...req.body || {},
          ...req.query || {},
          ...req.params || {},
          ...req.headers || {}
        })
        res
        .status(httpResponse.statusCode)
        .send(httpResponse.body)
      }
    })
  }

  registerCallback({method, route, callback}: RegisterCallbackInput): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const response = await callback(req.body || {}, req.params || {}, req.query || {}, req.headers)
        res
        .status(response.statusCode)
        .send(response.body)
      }
    })
  }

  async start (port: number): Promise<Server> {
    await this.httpServer.listen({
      port
    })
    return this.httpServer.server
  }
}