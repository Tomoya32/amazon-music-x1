#!/bin/bash
if [ -e .env ]; then
    echo ".env file already exists"
else
    echo "REACT_APP_AMAZON_MUSIC_CLIENT_ID=$REACT_APP_AMAZON_MUSIC_CLIENT_ID" > .env
    echo "REACT_APP_SERIAL_NUMBER=$REACT_APP_SERIAL_NUMBER" >> .env
    echo "REACT_APP_MUSIC_ENDPOINT=$REACT_APP_MUSIC_ENDPOINT" >> .env
fi
