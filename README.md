# lg-netcast

Netcast client written in js/ts

## Installation

```
npm install lg-netcast
```

## Usage Example

Initialize the client with the API host. By default the port is `:8080`, make sure you add that to your API_HOST

Get current channel information

```typescript
const client = new NetcastClient(API_HOST);
client.get_session(access_token).then(async (session_id) => {
    const cur_channel = await client.get_current_channel(session_id);
    console.log(cur_channel)
});
```

Check the [API docs](./docs.md) for general usage on this package

## Authentication

To interact with the TV, you need a valid `access_token`. The access token is actually just the pair code of the TV, you can get that with `client.display_pair_code()`.

## License

MIT 