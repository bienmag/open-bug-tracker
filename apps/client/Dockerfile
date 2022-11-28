FROM node:18

COPY package.json yarn.lock* ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]