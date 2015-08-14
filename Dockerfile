FROM node:0.12.7

ADD package.json /source/package.json
WORKDIR /source
RUN npm install

ADD . /source

ENV APPLICATION_PORT=80
EXPOSE 80

CMD ["npm", "start"]
