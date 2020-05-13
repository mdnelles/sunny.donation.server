FROM node:13

RUN mkdir -p /srv/app/server
WORKDIR /srv/app/server

COPY package.json /srv/app/server/package.json
COPY package-lock.json /srv/app/server/package-lock.json

RUN npm install

COPY . /srv/app/server

EXPOSE 5000

# You can change this
#CMD [ "npm", "run", "dev" ]
CMD [ "npm", "run", "start" ]

