#!/usr/bin/env bash

WORK_DIR=`pwd`
FUNCTION_NAME="ContactForm"
PAYLOAD='{"task":"CONTACT","params":{"email":"ping@blogfordevs.com","name":"John","message":"Hello"}}'
OUTPUT_FILE=result.log

aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --payload $PAYLOAD \
  $OUTPUT_FILE

# https://7gxigtw4l1.execute-api.eu-west-1.amazonaws.com/prod/ContactForm