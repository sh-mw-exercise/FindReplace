#!/bin/bash

node -v
echo $?

if [[ $? -eq 0 ]]
   then
      cd app
      npm i
      cd ../parse
      npm i
      cd ../replace
      npm i
      cd ../test
      npm i
   else
      "Please install node"
fi