To generate a client-library from the OpenAPI spec, run:

```bash
yarn global add @openapitools/openapi-generator-cli
```

Typescript Fetch Client:
```bash
openapi-generator-cli generate -i ./v1/openapi.yaml -g typescript-fetch -o ./client-ts -c ./v1/ts-fetch-config.yaml
```

Go Client:
```bash
openapi-generator-cli generate -i ./v1/openapi.yaml -g go -o ./client-go
```


