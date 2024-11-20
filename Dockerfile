FROM node:20.1

WORKDIR app/

RUN npm i -g pnpm
RUN pnpm i -g @nestjs/cli

ADD package.json .
ADD pnpm-lock.yaml .

RUN pnpm i

ADD . .

EXPOSE 4000

RUN pnpm run build

CMD pnpm run start:dist
