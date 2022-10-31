FROM node:18 as base
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn --frozen-lockfile
COPY . .
RUN yarn prisma generate
EXPOSE 3000
RUN chown -R node /app
USER node

FROM base as test
CMD ["yarn", "test:integration"]

FROM base as prod
CMD ["yarn", "start"]
