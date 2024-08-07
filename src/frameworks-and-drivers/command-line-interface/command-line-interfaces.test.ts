import { mock } from "vitest-mock-extended"
import { CommanderCommandLineInterface } from "./commander-command-line-interface"
import { Controller } from "../../interface-adapters/controllers/controller"

suite('Command line interfaces', () => {
  let sut: CommanderCommandLineInterface

  beforeEach(() => {
    sut = new CommanderCommandLineInterface()
  })

  test('run controller with with no args', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'any_name',
      controller
    })

    sut.start('any_name')

    expect(controller.handle).toHaveBeenCalledOnce()
  })
  
  test('run controller with args', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'any_name',
      controller,
      args: '<any_arg> <other_arg> <another_arg>'
    })

    sut.start('any_name any_arg any_value other_arg other_value another_arg another_value')

    expect(controller.handle).toBeCalledWith({
      any_arg: 'any_value',
      other_arg: 'other_value',
      another_arg: 'another_value'
    })
  })

  test.todo('run controller with boolean options', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'any_name',
      controller,
      options: '--any_option'
    })
  })
})