import { mock } from "vitest-mock-extended"
import { CommanderCommandLineInterface } from "./commander-command-line-interface"
import { Controller } from "../../interface-adapters/controllers/controller"

suite('Command line interfaces', () => {
  let sut: CommanderCommandLineInterface

  beforeEach(() => {
    sut = new CommanderCommandLineInterface()
  })

  test('run controller with no error', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'any_name',
      controller
    })

    sut.start('any_name'.split(' '))

    expect(controller.handle).toHaveBeenCalledOnce()
  })
  
  test.todo('run controller with args', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'any_name',
      controller
    })

    sut.start('any_name --some args'.split(' '))

    expect(controller.handle).toBeCalledWith({
      some: 'args'
    })
  })
})