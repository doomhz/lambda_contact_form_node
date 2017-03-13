#!/usr/bin/env bash

WORK_DIR=`pwd`
FUNCTION_NAME="ContactForm"
LAMBDA_CODE_PATH=$WORK_DIR/../build
ZIP_CODE_FILE=$FUNCTION_NAME.zip

npm run build
cd $LAMBDA_CODE_PATH
rm $ZIP_CODE_FILE
zip -r -D $ZIP_CODE_FILE *

aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://$ZIP_CODE_FILE
