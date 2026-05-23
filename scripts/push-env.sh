#!/bin/bash

ENV_FILE=$1
VERCEL_ENV=$2

while IFS='=' read -r key value
do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue

  echo "$value" | vercel env add "$key" "$VERCEL_ENV"
done < "$ENV_FILE"