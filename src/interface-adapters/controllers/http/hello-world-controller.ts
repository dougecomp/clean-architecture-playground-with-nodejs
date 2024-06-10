import { HttpResponse, ok } from "./helpers";
import { HttpController } from "./http-controller";

export interface HelloWorldControllerInput {
  name: string
}

export interface HelloWorldControllerOutput {
  message: string
}

export class HelloWorldController implements HttpController<HelloWorldControllerInput> {
  async handle (request: HelloWorldControllerInput): Promise<HttpResponse> {
    return ok<HelloWorldControllerOutput>({
      message: `Hello World ${request.name}!`
    })
  }
}