#!/bin/bash

API="http://localhost:4741"
URL_PATH="/shows"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "show": {
      "title": "'"${TITLE}"'",
      "starring": "'"${STARRING}"'",
      "director": "'"${DIRECTOR}"'",
      "description": "'"${DESCRIPTION}"'",
      "released": "'"${RELEASED}"'"
    }
  }'

echo