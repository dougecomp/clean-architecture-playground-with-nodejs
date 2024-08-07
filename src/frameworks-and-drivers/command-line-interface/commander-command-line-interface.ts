import {Command} from 'commander'

import { CommandLineInterface, RegisterControllerToCommandLineInterfaceInput } from "./command-line-interface";

export class CommanderCommandLineInterface implements CommandLineInterface {
  constructor (
    private readonly program: Command = new Command()
  ) {}

  registerController(input: RegisterControllerToCommandLineInterfaceInput): void {
    this.program
    .command(input.name)
    .action(async (/* _, _command: Command */) => {
      const controller = input.controller
      const response = await controller.handle({})
      if (response.error) {
        this.program.error(response.error?.message)
      }
    })
  }
  
  start(command: string[]): void {
    this.program.parse(command, {from: 'user'})
  }
}