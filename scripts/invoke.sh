#!/usr/bin/env bash

WORK_DIR=`pwd`
FUNCTION_NAME="ContactForm"
PAYLOAD='{"task":"CONTACT","params":{"email":"john.doe@test.com","name":"John","message":"Hello"}}'
OUTPUT_FILE=result.log

aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --payload $PAYLOAD \
  $OUTPUT_FILE
