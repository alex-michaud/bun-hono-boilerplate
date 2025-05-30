bunx @ivotoby/openapi-mcp-server \
  --api-base-url http://localhost:3000 \
  --openapi-spec ./docs/openapi.json \
  --headers "X-API-Key:your-api-key" \
  --name "my-mcp-server" \
  --server-version "1.0.0" \
  --transport http \
  --port 4000 \
  --host 127.0.0.1 \
  --path /mcp \
  --disable-abbreviation true