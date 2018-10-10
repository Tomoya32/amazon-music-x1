FROM node:9 as builder
RUN mkdir /amazonmusic-x1
WORKDIR /amazonmusic-x1
COPY . /amazonmusic-x1

ARG REACT_APP_AMAZON_MUSIC_BASE_URL
ARG REACT_APP_AMAZON_API_BASE_URL

ENV REACT_APP_AMAZON_MUSIC_BASE_URL=$REACT_APP_AMAZON_MUSIC_BASE_URL
ENV REACT_APP_AMAZON_API_BASE_URL=$REACT_APP_AMAZON_API_BASE_URL

RUN echo "Using ENV variable REACT_APP_AMAZON_MUSIC_BASE_URL: $REACT_APP_AMAZON_MUSIC_BASE_URL"
RUN echo "Using ENV variable REACT_APP_AMAZON_API_BASE_URL: $REACT_APP_AMAZON_API_BASE_URL"

RUN yarn
RUN yarn build

# Copy built app into nginx container
FROM nginx:1.15.0
COPY --from=builder /amazonmusic-x1/build /usr/share/nginx/html
COPY --from=builder /amazonmusic-x1/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
