FROM node:lts-slim AS build

WORKDIR /srv/app

COPY ./auth-front/package.json ./
COPY ./auth-front/package-lock.json ./
RUN npm install

COPY ./platts-front ./

RUN npm run build || { echo "Build failed!"; exit 1; }

CMD ["tail", "-f", "/dev/null"]
