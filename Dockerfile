FROM node:12
WORKDIR /usr/src/app
ADD package.json yarn.lock ./

RUN yarn --pure-lockfile
RUN rm -f ~/.npmrc
RUN rm -f .yarnrc

ADD tsconfig.json ./
ADD src ./src
ADD typings ./typings
ADD peerIdA.json ./peerIdA.json
ADD peerIdB.json ./peerIdB.json
ADD peerIdC.json ./peerIdC.json
ADD peerIdD.json ./peerIdD.json
RUN yarn build
RUN mkdir lib/tmp
RUN mkdir tmp
CMD ["npx", "forever", "./lib" ]
