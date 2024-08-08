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
    if (input.args) {
      command.arguments(input.args)
    }
    if (input.options) {
      input.options.forEach(option => {
        command.option(`${option.short}, ${option.long}`)
      })
    }
    command.action(async () => {
      const controllerInput = {
        ...this.adaptArgsToControllerInput(command.args || []),
        ...command.opts()
      }
      const controllerResponse = await input.controller.handle(controllerInput)
      if (controllerResponse.error) {
        command.error(controllerResponse.error.message)
      }
    })
  }
  
  async run(command: string): Promise<void> {
    await this.program.parseAsync(command.split(' '), { from: 'user' })
  }
}