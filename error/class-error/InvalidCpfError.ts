export default class InvalidCpfError extends Error {
  private cpf: string;
  constructor(cpf: string, message?: string) {
    if (!message) {
      super(`Invalid ${cpf} CPF`);
    } else {
      super(message);
    }

    Object.setPrototypeOf(this, InvalidCpfError.prototype);
    this.cpf = cpf;
  }
}
