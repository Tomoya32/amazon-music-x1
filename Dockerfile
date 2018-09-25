FROM node:9 as builder
RUN mkdir /amazonmusic-x1
WORKDIR /amazonmusic-x1
COPY . /amazonmusic-x1

ARG REACT_APP_AMAZON_MUSIC_CLIENT_ID
ARG REACT_APP_SERIAL_NUMBER
ARG REACT_APP_MUSIC_ENDPOINT
ARG REACT_APP_TEST_STRING
ARG REACT_APP_TEST_STRING_2=ok

ENV REACT_APP_AMAZON_MUSIC_CLIENT_ID=${REACT_APP_AMAZON_MUSIC_CLIENT_ID}
ENV REACT_APP_SERIAL_NUMBER=${REACT_APP_SERIAL_NUMBER}
ENV REACT_APP_MUSIC_ENDPOINT=${REACT_APP_MUSIC_ENDPOINT}
ARG REACT_APP_TEST_STRING=${REACT_APP_TEST_STRING}

RUN yarn
RUN yarn build

# Copy built app into nginx container
FROM nginx:1.15.0
COPY --from=builder /amazonmusic-x1/build /usr/share/nginx/html
COPY --from=builder /amazonmusic-x1/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
