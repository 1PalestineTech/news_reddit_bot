FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 300
CMD npm start