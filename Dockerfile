FROM node:22-alpine AS base

ENV PORT=3000

WORKDIR /app
COPY . .
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm build
CMD pnpm start --port ${PORT}
