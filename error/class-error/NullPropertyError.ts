export default class NullPropertyError extends Error {
  private nullProperties: string[];
  constructor(nullProperties: string[], message?: string) {
    if (!message) {
      super(`Null Properties : ${nullProperties.join(", ")}`);
    } else {
      super(message);
    }

    Object.setPrototypeOf(this, NullPropertyError.prototype);
    this.nullProperties = nullProperties;
  }
}
