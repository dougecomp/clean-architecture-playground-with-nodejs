export type ControllerOutput<T = any> = {
  data?: T
  error?: Error
}

export interface Controller<T = any, U = any> {
  handle(input: T): Promise<ControllerOutput<U>>
}