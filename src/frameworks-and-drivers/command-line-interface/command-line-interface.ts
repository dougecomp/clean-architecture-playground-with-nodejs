import { Controller } from "../../interface-adapters/controllers/controller"

export interface RegisterControllerToCommandLineInterfaceInput {
  name: string,
  controller: Controller
  args?: string
  options?: string
}

export interface CommandLineInterface {
  registerController(input: RegisterControllerToCommandLineInterfaceInput): void
  start(command: string): void
}