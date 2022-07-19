export default class InvalidCpfError extends Error {
  private cpf: string;
  constructor(message: string, cpf: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidCpfError.prototype);
    this.cpf = cpf;
  }
  getMessage() {
    return `Invalid CPF`;
  }
}
