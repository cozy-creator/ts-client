#!/bin/bash

# Generate TypeScript client from OpenAPI spec
openapi-generator-cli generate \
  -i ./spec/v1/openapi.yaml \
  -g typescript-fetch \
  -o ./typescript-client/src \
  -c ./typescript-client/openapi-generator-config.yaml
