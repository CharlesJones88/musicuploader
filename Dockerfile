FROM node:latest
RUN npm install --global --silent pnpm
COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
RUN npm install
COPY *.ts /
CMD ["pnpm", "start"]
