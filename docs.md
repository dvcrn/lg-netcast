<a name="NetcastClient"></a>

## NetcastClient
<p>Client to interact with necast TVs
host has to include a valid port number. By default LG TVs use 8080 so make sure to specify that
eg. 192.168.1.3:8080</p>
<p>Following options are supported:</p>
<pre class="prettyprint source"><code>interface Options {
  timeout: 2000;
}
</code></pre>

**Kind**: global class  

* [NetcastClient](#NetcastClient)
    * [new NetcastClient(host, options)](#new_NetcastClient_new)
    * [.wrap_command(command_type, command, session)](#NetcastClient+wrap_command)
    * [.send_to_tv(message_type, message, payload)](#NetcastClient+send_to_tv)
    * [.display_pair_code()](#NetcastClient+display_pair_code)
    * [.get_session(access_token)](#NetcastClient+get_session)
    * [.query_data(query)](#NetcastClient+query_data)
    * [.send_command(command, session)](#NetcastClient+send_command)
    * [.change_channel(channel, session)](#NetcastClient+change_channel)
    * [.get_current_channel(session)](#NetcastClient+get_current_channel)

<a name="new_NetcastClient_new"></a>

### new NetcastClient(host, options)
<p>Creates a new NetcastClient instance</p>


| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | <p>The host</p> |
| options | <code>2000</code> | <p>The options</p> |

<a name="NetcastClient+wrap_command"></a>

### netcastClient.wrap\_command(command_type, command, session)
<p>Wraps the given command into an XML block ready to send to the TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| command_type | <code>LG\_HANDLE</code> |  | <p>LG_HANDLE</p> |
| command | <code>Channel</code> |  | <p>either a LG_COMMAND or other payload, such as Channel</p> |
| session | <code>string</code> | <code>null</code> | <p>the current session id. if not specified, the command will be unauthenticated</p> |

<a name="NetcastClient+send_to_tv"></a>

### netcastClient.send\_to\_tv(message_type, message, payload)
<p>Sends the given message to the TV. message has to be in XML format Will
return a javascript object with the result, or throw an exception</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message_type | <code>string</code> |  | <p>Type of the message to send, eg 'data', 'command', 'auth'</p> |
| message | <code>string</code> | <code>null</code> | <p>Message to send in XML string format</p> |
| payload | <code>object</code> | <code></code> | <p>Payload &amp; (GET) parameters to send</p> |

<a name="NetcastClient+display_pair_code"></a>

### netcastClient.display\_pair\_code()
<p>Issues a command to the TV to display the pair code // access token</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  
<a name="NetcastClient+get_session"></a>

### netcastClient.get\_session(access_token)
<p>Retrieves (or creates) the current session used for interacting with the
TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| access_token | <code>string</code> | <code>null</code> | <p>Access token aka pair code</p> |

<a name="NetcastClient+query_data"></a>

### netcastClient.query\_data(query)
<p>Issues a query command to the TV to retrieve current information such as
channel, volume, etc</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>LG\_QUERY</code> | <p>What to query. See LG_QUERY type</p> |

<a name="NetcastClient+send_command"></a>

### netcastClient.send\_command(command, session)
<p>Sends the given command to the TV To issue commands, you need a valid
session id. To retrieve that, use <code>get_session()</code> paired with the
access_token of the TV To get the access_token, use <code>display_pair_code()</code></p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>LG\_COMMAND</code> | <p>The command to send, see LG_COMMAND type</p> |
| session | <code>string</code> | <p>Session id</p> |

<a name="NetcastClient+change_channel"></a>

### netcastClient.change\_channel(channel, session)
<p>Changes channel to the given channel</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>Channel</code> | <p>The channel to switch to. Has to be in a specific format, see Channel type</p> |
| session | <code>string</code> | <p>Session id</p> |

<a name="NetcastClient+get_current_channel"></a>

### netcastClient.get\_current\_channel(session)
<p>Retrieves the current channel information from the TV</p>

**Kind**: instance method of [<code>NetcastClient</code>](#NetcastClient)  

| Param | Type | Description |
| --- | --- | --- |
| session | <code>string</code> | <p>The session</p> |

