export type ControllerOutput = {
  data?: any
  error?: Error
}

export interface Controller<T = any> {
  handle(input: T): Promise<ControllerOutput>
}