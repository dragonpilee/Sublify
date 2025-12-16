FROM node:20-slim

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host"]
