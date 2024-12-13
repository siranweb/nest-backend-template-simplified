export class AppError<Data extends Record<any, any>> extends Error {
  public readonly name: string;
  public readonly data: Data;
  public cause?: unknown;

  constructor(name: string, data: Data) {
    super();
    this.name = name;
    this.data = data;
  }
}
