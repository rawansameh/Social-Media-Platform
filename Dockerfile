FROM node:20.3.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli

RUN npm rebuild sharp

COPY . .

#COPY .env ./

#RUN npm run build

EXPOSE 3000

CMD ["npm", "run","start"]
#CMD ["node", "dist/src/main.js"]
