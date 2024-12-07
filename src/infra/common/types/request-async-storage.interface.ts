import { AsyncLocalStorage } from 'node:async_hooks';

export interface IRequestAsyncStorage extends AsyncLocalStorage<TRequestAsyncStorageStore> {}

export type TRequestAsyncStorageStore = {
  requestId: string;
};
