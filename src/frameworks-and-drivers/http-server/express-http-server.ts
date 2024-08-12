import { Server } from 'node:http';

import express, { Express, Request, Response } from 'express';

import { extractHttpResponse } from './helpers';
import { HttpServer, RegisterControllerInput } from "./http-server";

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
    this.httpServer.use(express.json())
  }
  
  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
      const controllerResponse = await controller.handle({
        ...req.body as any,
        ...req.params as any,
        ...req.query as any,
        ...req.headers as any
      })
      const {body, statusCode} = extractHttpResponse({
        data: controllerResponse.data,
        error: controllerResponse.error,
        method
      })
      return res
      .status(statusCode)
      .send(body)
    })
  }

  async start(port: number): Promise<Server> {
    return this.httpServer.listen(port)
  }
  
}