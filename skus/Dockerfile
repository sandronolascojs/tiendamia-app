FROM node:18 AS builder

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm test

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm i --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/data.json ./data.json

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG HTTP_PORT

RUN addgroup -S app && adduser -S app -G app

USER app

CMD ["node", "dist/src/main"]





