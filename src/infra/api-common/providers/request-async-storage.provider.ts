import { AsyncLocalStorage } from 'node:async_hooks';
import { IRequestAsyncStorage } from '@/infra/common/types/request-async-storage.interface';

// We need to access requestAsyncStorage before application creation
export const requestAsyncStorage: IRequestAsyncStorage = new AsyncLocalStorage();
