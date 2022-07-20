export default class DatabaseError extends Error {
  private statusCode = 500;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  getStatusCode() {
    return this.statusCode;
  }
}
