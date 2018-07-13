## discord.js docs API

A simple API to server discord.js docs using [discord.js-docs](https://github.com/TeeSeal/discord.js-docs).

## Routes

### GET `/:project/:branch`
Returns the entire formatted documentation for the given project and branch.\
Project can be one of: `main`, `commando`, `rpc`.

Add `?raw=true` to receive the original fetched JSON without any formatting.

### GET `/:project/:branch/el/:parent/:child`
Returns the documentation for a single element.\
`:parent` and `:child` have to be element names. Case does not matter.\
`:child` can be omitted.

Add `?raw=true` to receive the original fetched JSON without any formatting.

### GET `/:project/:branch/search`
Searches the documentation using fuzzy search and returns top 10 hits.\
The query must be specified under the `q` queryparam.

Will return 400 if no query specified.

Example:
```
/main/master/search?q=reaction%20collector
```

### GET `/:project/:branch/embed`
Tries to resolve the query into a single element.\
The query must be specified under the `q` queryparam.\
If that fails back to the behaviour of the `.../search` route.\
Query is expected to be separated with `#` (%23 when uri encoded) or `.` for exact searches.

The result is formatted into a [Discord embed object](https://discordapp.com/developers/docs/resources/channel#embed-object).

Will return 400 if no query specified.

Examples:
```
/main/stable/embed?q=message%23pin
/main/master/embed?q=reaction%20collector
```
