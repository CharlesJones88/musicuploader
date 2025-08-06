FROM node:lts-alpine

COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
COPY pnpm-workspace.yaml /pnpm-workspace.yaml
COPY src /src

RUN corepack enable pnpm && pnpm install

ENTRYPOINT ["pnpm", "start"]
