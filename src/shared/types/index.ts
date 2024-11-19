export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const emptySymbol = Symbol('TEmptyObject');
export type TEmptyObject = { [emptySymbol]?: never };
