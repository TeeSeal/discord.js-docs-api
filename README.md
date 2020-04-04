## discord.js docs API

A simple API to serve discord.js docs using [discord.js-docs](https://github.com/TeeSeal/discord.js-docs).

## Documentation

<details>
<summary>V1</summary>

## Routes

### GET `/v1/:project/:branch`
Returns the entire formatted documentation for the given project and branch.\
Project can be one of: `main`, `commando`, `rpc`.

> Set the `raw` queryparam to `true` to receive the original fetched JSON without any formatting.\
> Doesn't work for the `/search` and `/embed` endpoints.\
> Example: `/v1/main/master?raw=true`, `/v1/main/stable/message/content?raw=true`

> Set the `force` queryparam to `true` to force fetch the docs instead of reading from cache.\
> Works for all endpoints.\
> Example: `/v1/main/master?force=true`

### GET `/v1/:project/:branch/el/:parent/:child`
Returns the documentation for a single element.\
`:parent` and `:child` have to be element names. Case does not matter.\
`:child` can be omitted.

### GET `/v1/:project/:branch/search`
Searches the documentation using fuzzy search and returns top 10 hits.\
The query must be specified under the `q` queryparam.

Will return 400 if no query specified.

Example:
```
/v1/main/master/search?q=reaction%20collector
```

### GET `/v1/:project/:branch/embed`
Tries to resolve the query into a single element.\
The query must be specified under the `q` queryparam.\
If that fails, falls back to the behaviour of the `.../search` route.\
Query is expected to be separated with `#` (%23 when uri encoded) or `.` for exact searches.

The result is formatted into a [Discord embed object](https://discordapp.com/developers/docs/resources/channel#embed-object).

Will return 400 if no query specified.

Examples:
```
/v1/main/stable/embed?q=message%23pin
/v1/main/master/embed?q=reaction%20collector
```
</details>

<details>
<summary>V2</summary>

The version 2 of the API relies more on query parameters. The query parameters you should know about
for all endpoints are the following:

- `src` - Source. Indicates the what documentation data should be pulled from. This parameter can be
an URL to a valid JSON file containing the docs **or** one of the predefined keywords:
`stable`, `master`, `commando`, `rpc`, `akairo`, `akairo-master` and `collection`

- `force` - `true` or `false`. Indicates whether local cache should be ignored. In case it is set to `true`, the
documentation will be pulled anew from the source and cached, overwriting the old one. Defaults to `false`.

- `q` - Query. Meaning depends on endpoint, see more detailed description below.

## Routes

### GET `/v2`

 Query Parameter | Description | Examples
:---------------:|:-----------:|:--------:
`src` | Source documentation | `master`
`force` | Ignore cache | `true`, `false`
`q`| Query | `Client`, `Message#author`, `Message.author.username`

Returns the documentation for a single element. Query should be well formed as shown in the example.\
Use `#` (`%23` when URI encoded) or `.` as separators.

Examples:
```
/v2?src=master&q=Client
/v2?src=stable&force=true&q=Message%23author
```

### GET `/v2/search`

 Query Parameter | Description | Examples
:---------------:|:-----------:|:--------:
`src` | Source documentation | `master`
`force` | Ignore cache | `true`, `false`
`q`| Query | `permissions`, `ban member`

Searches the documentation for the given query and returns top 10 hits. Query can be whatever.

Examples:
```
/v2/search?src=master&q=permissions
/v2/search?src=stable&force=true&q=ban%20member
```

### GET `/v2/embed`

 Query Parameter | Description | Examples
:---------------:|:-----------:|:--------:
`src` | Source documentation | `master`
`force` | Ignore cache | `true`, `false`
`q`| Query | `permissions`, `ban member`

Tries to resolve the query into a single element.\
If that fails, falls back to the behaviour of the `/v2/search` endpoint.\
The result is formatted into a [Discord embed object](https://discordapp.com/developers/docs/resources/channel#embed-object).

Examples:
```
/v2/embed?src=master&q=permissions
/v2/embed?src=stable&force=true&q=ban%20member
```

</details>
