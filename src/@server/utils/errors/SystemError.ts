export class SystemError extends Error {
  status = 500
  constructor(message: string = 'Erro interno do servidor') {
    super(message)
    this.name = 'SystemError'
  }
}
