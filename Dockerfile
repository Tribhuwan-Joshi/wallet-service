FROM node:20-alpine
WORKDIR /app
copy package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["sh","-c" ,"npm run migrate && node src/server.js"]

    