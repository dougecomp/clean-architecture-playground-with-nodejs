import express, {Express, Request, Response} from 'express'

import { HttpController } from "../../interface-adapters/controllers/http/http-controller";
import { HttpServer } from "./http-server";
import { HTTP_VERBS } from '../../interface-adapters/controllers/http/helpers';

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
  }

  async register(method: HTTP_VERBS, route: string, controller: HttpController<any, any>): Promise<void> {
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
  async start(port: number): Promise<void> {
    this.httpServer.listen(port)
  }
  
}