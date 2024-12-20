FROM node:22-alpine AS base

# Update packages on base image (alpine comes with vulnerable version of
# libssl: libssl@3.3.2-r0)
RUN apk update && apk upgrade
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Dependencies
FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN yarn build
RUN rm -r node_modules
RUN yarn --frozen-lockfile --production

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

ENV PORT=3000

CMD ["yarn", "start:prod"]