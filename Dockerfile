FROM node:9 as builder
RUN mkdir /amazonmusic-x1
WORKDIR /amazonmusic-x1
COPY . /amazonmusic-x1

ARG AMAZON_MUSIC_CLIENT_ID
ARG SERIAL_NUMBER
ARG MUSIC_ENDPOINT

ENV REACT_APP_AMAZON_MUSIC_CLIENT_ID=$AMAZON_MUSIC_CLIENT_ID
ENV REACT_APP_SERIAL_NUMBER=$SERIAL_NUMBER
ENV REACT_APP_MUSIC_ENDPOINT=$MUSIC_ENDPOINT

RUN echo "Using client ID ${REACT_APP_AMAZON_MUSIC_CLIENT_ID}"
RUN echo "Using serial number ${REACT_APP_SERIAL_NUMBER}"
RUN echo "Using endpoint ${REACT_APP_MUSIC_ENDPOINT}"

RUN yarn
RUN yarn build

# Copy built app into nginx container
FROM nginx:1.15.0
COPY --from=builder /amazonmusic-x1/build /usr/share/nginx/html
COPY --from=builder /amazonmusic-x1/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
