<a name="NetcastClient"></a>

## NetcastClient
<p>Client to interact with necast TVs
host has to include a valid port number. By default LG TVs use 8080 so make sure to specify that
eg. 192.168.1.3:8080</p>

**Kind**: global class  

* [NetcastClient](#NetcastClient)
    * [.wrap_command(command_type, command, session)](#NetcastClient+wrap_command)
    * [.send_to_tv(message_type, message, payload)](#NetcastClient+send_to_tv)
    * [.display_pair_code()](#NetcastClient+display_pair_code)
    * [.get_session(access_token)](#NetcastClient+get_session)
    * [.query_data(query)](#NetcastClient+query_data)
    * [.send_command(command, session)](#NetcastClient+send_command)
    * [.change_channel(channel, session)](#NetcastClient+change_channel)
    * [.get_current_channel()](#NetcastClient+get_current_channel)

<a name="NetcastClient+wrap_command"></a>

### netcastClient.wrap\_command(command_type, command, session)
<p>Wraps the given command into an XML block ready to send to the TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Default | Description |
| --- | --- | --- |
| command_type |  | <p>LG_HANDLE</p> |
| command |  | <p>either a LG_COMMAND or other payload, such as Channel</p> |
| session | <code></code> | <p>the current session id. if not specified, the command will be unauthenticated</p> |

<a name="NetcastClient+send_to_tv"></a>

### netcastClient.send\_to\_tv(message_type, message, payload)
<p>Sends the given message to the TV. message has to be in XML format
Will return a javascript object with the result, or throw an exception</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Default | Description |
| --- | --- | --- |
| message_type |  | <p>Type of the message to send, eg 'data', 'command', 'auth'</p> |
| message | <code></code> | <p>Message to send in XML string format</p> |
| payload | <code></code> | <p>Payload &amp; (GET) parameters to send</p> |

<a name="NetcastClient+display_pair_code"></a>

### netcastClient.display\_pair\_code()
<p>Issues a command to the TV to display the pair code // access token</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  
<a name="NetcastClient+get_session"></a>

### netcastClient.get\_session(access_token)
<p>Retrieves (or creates) the current session used for interacting with the TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Default | Description |
| --- | --- | --- |
| access_token | <code></code> | <p>Access token aka pair code</p> |

<a name="NetcastClient+query_data"></a>

### netcastClient.query\_data(query)
<p>Issues a query command to the TV to retrieve current information such as channel, volume, etc</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Description |
| --- | --- |
| query | <p>What to query. See LG_QUERY type</p> |

<a name="NetcastClient+send_command"></a>

### netcastClient.send\_command(command, session)
<p>Sends the given command to the TV
To issue commands, you need a valid session id. To retrieve that, use <code>get_session()</code> paired with the access_token of the TV
To get the access_token, use <code>display_pair_code()</code></p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Description |
| --- | --- |
| command | <p>The command to send, see LG_COMMAND type</p> |
| session | <p>Session id</p> |

<a name="NetcastClient+change_channel"></a>

### netcastClient.change\_channel(channel, session)
<p>Changes channel to the given channel</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Description |
| --- | --- |
| channel | <p>The channel to switch to. Has to be in a specific format, see Channel type</p> |
| session | <p>Session id</p> |

<a name="NetcastClient+get_current_channel"></a>

### netcastClient.get\_current\_channel()
<p>Retrieves the current channel information from the TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  
