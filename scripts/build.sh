#!/usr/bin/env bash

rm -rf ./build
babel src --out-dir build --copy-files
cp ./package.json ./build/
cd ./build
NODE_ENV=production npm install
rm package.json