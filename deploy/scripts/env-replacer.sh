#!/bin/bash

file=$1

environments=$(cat $file | grep -o '{{[^{}]*}}' | sort -u)

for environment in $environments; do
  key="${environment:2:-2}"
  value="${!key}"
  echo "Replaced environment: $key -> $value"
  sed -i "s|$environment|$value|g" $file
done
