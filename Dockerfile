FROM oven/bun:1.3.14-alpine

WORKDIR /workspace/app

COPY package.json bun.lock ./

RUN bun install 

COPY . .

