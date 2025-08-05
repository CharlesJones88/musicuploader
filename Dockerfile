FROM node:latest
RUN corepack enable pnpm
COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
RUN pnpm install
COPY *.ts /
ENTRYPOINT ["pnpm", "start"]
