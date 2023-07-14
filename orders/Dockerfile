FROM node:18 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

RUN pnpm prune --prod

FROM node:18-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
RUN chmod -R a+rw /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --production --frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

RUN pnpm prisma generate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER app

ARG PORT
EXPOSE $PORT

CMD ["node", "dist/src/main.js"]
