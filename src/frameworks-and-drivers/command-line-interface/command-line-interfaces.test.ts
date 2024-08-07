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
      name: 'a_command_name',
      controller
    })

    sut.start('a_command_name')

    expect(controller.handle).toHaveBeenCalledOnce()
  })
  
  test('run controller with args', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'a_command_name',
      controller,
      args: '<any_arg> <other_arg> <another_arg>'
    })

    sut.start('a_command_name any_arg any_value other_arg other_value another_arg another_value')

    expect(controller.handle).toBeCalledWith({
      any_arg: 'any_value',
      other_arg: 'other_value',
      another_arg: 'another_value'
    })
  })

  test('run controller with long boolean option', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'a_command_name',
      controller,
      options: [
        {
          long: '--any_option',
          short: '-a'
        }
      ]
    })

    sut.start('a_command_name --any_option')

    expect(controller.handle).toBeCalledWith({
      any_option: true
    })
  })

  test('run controller with short boolean option', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'a_command_name',
      controller,
      options: [
        {
          long: '--any_option',
          short: '-a'
        }
      ]
    })

    sut.start('a_command_name -a')

    expect(controller.handle).toBeCalledWith({
      any_option: true
    })
  })

  test('run controller with long value options', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'a_command_name',
      controller,
      options: [
        {
          long: '--any_option <option>',
          short: '-a'
        }
      ]
    })

    sut.start('a_command_name --any_option any_value')

    expect(controller.handle).toBeCalledWith({
      any_option: 'any_value'
    })
  })

  test('run controller with short value options', async () => {
    const controller = mock<Controller>()
    controller.handle.mockResolvedValue({ data: { any: 'data'} })

    sut.registerController({
      name: 'a_command_name',
      controller,
      options: [
        {
          long: '--any_option <option>',
          short: '-a'
        }
      ]
    })

    sut.start('a_command_name -a any_value')

    expect(controller.handle).toBeCalledWith({
      any_option: 'any_value'
    })
  })
})