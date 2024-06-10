import { Server } from 'node:http'

import express, {Express, Request, Response} from 'express'

import { HttpController, HttpResponse } from "../../interface-adapters/controllers/http/http-controller";
import { HttpServer } from "./http-server";
import { HTTP_VERBS } from '../../interface-adapters/controllers/http/helpers';

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
    this.httpServer.use(express.json())
  }

  async registerController(method: HTTP_VERBS, route: string, controller: HttpController): Promise<void> {
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

  registerCallback(method: HTTP_VERBS, route: string, callback: (body: any, params: any, query: any, headers: any) => Promise<HttpResponse>): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
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