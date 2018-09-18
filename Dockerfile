FROM node:9 as builder
RUN mkdir /amazonmusic-x1
WORKDIR /amazonmusic-x1
COPY . /amazonmusic-x1

#ENV REACT_APP_AMAZON_MUSIC_CLIENT_ID=$REACT_APP_AMAZON_MUSIC_CLIENT_ID
#ENV REACT_APP_SERIAL_NUMBER=$REACT_APP_SERIAL_NUMBER
RUN echo $REACT_APP_AMAZON_MUSIC_CLIENT_ID
RUN echo $REACT_APP_SERIAL_NUMBER

RUN yarn
RUN yarn build

# Copy built app into nginx container
FROM nginx:1.15.0
COPY --from=builder /amazonmusic-x1/build /usr/share/nginx/html
COPY --from=builder /amazonmusic-x1/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
