FROM node:8

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 11999

CMD ["npm", "start"]