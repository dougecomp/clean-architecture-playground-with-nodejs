import { ok } from "./helpers";
import { HttpController, HttpResponse } from "./http-controller";

export interface HelloWorldControllerInput {
  name: string
}

export class HelloWorldController implements HttpController<HelloWorldControllerInput, string> {
  async handle (request: HelloWorldControllerInput): Promise<HttpResponse> {
    return ok({
      message: `Hello World ${request.name}!`
    })
  }
}