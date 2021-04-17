export class ProductError extends Error {
  public fields: string[] = [];
  constructor(message) {
    super(message);
    this.name = 'ProductError';
  }
}
