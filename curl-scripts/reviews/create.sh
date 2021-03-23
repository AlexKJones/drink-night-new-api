#!/bin/bash

API="http://localhost:4741"
URL_PATH="/create-review"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "review": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'",
      "rating": "'"${RATING}"'"
    }
  }'

echo
