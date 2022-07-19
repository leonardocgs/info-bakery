export default class NullPropertyError extends Error {
  private nullProperties;
  constructor(message: string, nullProperties: string[]) {
    super(message);
    Object.setPrototypeOf(this, NullPropertyError.prototype);
    this.nullProperties = nullProperties;
  }
  getMessage() {
    return `Null Properties : ${this.nullProperties.join(", ")}`;
  }
}
