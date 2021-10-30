FROM node:latest

RUN npm install --global --unsafe-perm pnpm
COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
RUN pnpm install
COPY *.ts /
CMD ["pnpm", "start"]