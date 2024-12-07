FROM node:20.1

WORKDIR app/

RUN npm i -g @nestjs/cli

ADD package.json .
ADD package-lock.json .

RUN ppm i

ADD . .

EXPOSE 4000

RUN npm run build

CMD npm run start:dist
