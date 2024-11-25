import fastify, { FastifyInstance, FastifyServerFactory } from 'fastify';
import * as http from 'node:http';
import { requestAsyncStorage } from '@/infra/common/providers/request-async-storage.provider';
import { uuidv4 } from 'uuidv7';

export function initInstance(): FastifyInstance {
  const serverFactory: FastifyServerFactory = (handler) => {
    return http.createServer((req, res) => {
      requestAsyncStorage.run(
        {
          requestId: uuidv4(),
        },
        () => handler(req, res),
      );
    });
  };

  return fastify({ serverFactory });
}
