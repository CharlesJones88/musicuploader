FROM node:latest
RUN apt-get update && apt-get install -y python
RUN npm install --global --silent pnpm
COPY package.json /package.json
COPY pnpm-lock.yaml /pnpm-lock.yaml
RUN npm install
COPY *.ts /
CMD ["pnpm", "start"]
