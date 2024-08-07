import { Server } from 'node:http';

import express, { Express, Request, Response } from 'express';

import { HttpServer, RegisterCallbackInput, RegisterControllerInput } from "./http-server";

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
    this.httpServer.use(express.json())
  }
  
  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
      const httpResponse = await controller.handle({
        ...req.body as any,
        ...req.params as any,
        ...req.query as any,
        ...req.headers as any
      })
      res
      .status(httpResponse.statusCode)
      .send(httpResponse.body)
    })
  }

  registerCallback({method, route, callback}: RegisterCallbackInput): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""),
    async (req, res) => {
      const response = await callback(req.body, req.params, req.query, req.headers)
      res
      .status(response.statusCode)
      .send(response.body)
    })
  }

  async start(port: number): Promise<Server> {
    return this.httpServer.listen(port)
  }
  
}