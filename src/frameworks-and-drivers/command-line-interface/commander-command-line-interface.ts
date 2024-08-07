import {Command} from 'commander'

import { CommandLineInterface, RegisterControllerToCommandLineInterfaceInput } from "./command-line-interface";

export class CommanderCommandLineInterface implements CommandLineInterface {
  constructor (
    private readonly program: Command = new Command()
  ) {}

  private adaptArgsToControllerInput (args: string[]): object {
    if (args.length === 0) {
      return {}
    }
    if (args.length % 2 !== 0) {
      throw new Error('Invalid number of arguments')
    }
    const controllerInput: any = {}
    for (let i = 0; i < args.length; i += 2) {
      controllerInput[args[i]] = args[i + 1]
    }
    return controllerInput
  }

  registerController(input: RegisterControllerToCommandLineInterfaceInput): void {
    const command = this.program
    .command(input.name)
    .action(async () => {
      const controller = input.controller
      const controllerInput = this.adaptArgsToControllerInput(command.args || [])
      const response = await controller.handle(controllerInput)
      if (response.error) {
        this.program.error(response.error?.message)
      }
    })
    if (input.args) {
      command.arguments(input.args)
    }
  }
  
  start(command: string): void {
    this.program.parse(command.split(' '), {from: 'user'})
  }
}