export enum ENodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const emptySymbol = Symbol('TEmptyObject');
export type TEmptyObject = { [emptySymbol]?: never };

export type TDecoratorFunc = (
  target: any,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor,
) => void;
