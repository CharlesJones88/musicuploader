FROM node:latest
RUN apt-get update && apt-get install -y python
RUN npm install --global npm
RUN npm install --global pnpm
COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
RUN pnpm install
COPY *.ts /
CMD ["pnpm", "start"]