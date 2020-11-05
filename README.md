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
    console.log(cur_channel);
});
```

Check the [API docs](./docs.md) for general usage on this package

## Authentication

To interact with the TV, you need a valid `access_token`. The access token is actually just the pair code of the TV, you can get that with `client.display_pair_code()`.

## CLI

This package comes with a very simple CLI to query TV information

```bash
Usage: netcast-cli [options]

Options:
  --host: Host of the TV
    (default: "192.168.1.1:8080")
  --access_token: Pair code of the TV
    (default: "123456")
    (an integer)
  --command: command to issue
    (default: "current_channel")
```

```bash
❯ netcast-cli --host 192.168.1.14:8080 --access_token 1234567
Querying current channel
{
  chtype: 'satellite',
  sourceIndex: '7',
  physicalNum: '265',
  major: '200',
  displayMajor: '200',
  minor: '65535',
  displayMinor: '-1',
  chname: 'スターチャンネル１',
  progName: 'エスケープ・ルーム（２０１９）',
  audioCh: '0',
  inputSourceName: 'TV',
  inputSourceType: '0',
  labelName: {},
  inputSourceIdx: '0'
}
```

## License

MIT
