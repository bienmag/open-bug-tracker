FROM node:18
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "yarn-lock*", "./"]
RUN yarn --frozen-lockfile
COPY . .
EXPOSE 3000
RUN chown -R node /app
USER node
CMD ["yarn", "start"]
