import { Controller, ControllerOutput } from "./controller"

export interface HelloWorldControllerInput {
  name: string
}

export interface HelloWorldControllerOutput {
  message: string
}

export class HelloWorldController implements Controller<HelloWorldControllerInput, HelloWorldControllerOutput> {
  async handle(input: HelloWorldControllerInput): Promise<ControllerOutput<HelloWorldControllerOutput>> {
    return {
      data: {
        message: `Hello World ${input.name}!`
      }
    }
  }
}