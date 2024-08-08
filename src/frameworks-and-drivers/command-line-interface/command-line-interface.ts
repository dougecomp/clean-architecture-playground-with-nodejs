import { Controller } from "../../interface-adapters/controllers/controller"

type CommandOptions = {
  long: string
  short: string
}

export interface RegisterControllerToCommandLineInterfaceInput {
  name: string,
  controller: Controller
  args?: string
  options?: CommandOptions[]
}

export interface CommandLineInterface {
  registerController(input: RegisterControllerToCommandLineInterfaceInput): void
  run(command: string): Promise<void>
}