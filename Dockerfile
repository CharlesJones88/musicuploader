FROM node:lts-alpine

COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
COPY *.ts /

RUN corepack enable pnpm && pnpm install

ENTRYPOINT ["pnpm", "start"]
