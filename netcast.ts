// Inspired by https://github.com/wokar/pylgnetcast
import convert, { ElementCompact } from 'xml-js';
import fetch from 'node-fetch';
import timeout_signal from 'timeout-signal';

export enum LG_HANDLE {
    LG_HANDLE_KEY_INPUT = 'HandleKeyInput',
    LG_HANDLE_MOUSE_MOVE = 'HandleTouchMove',
    LG_HANDLE_MOUSE_CLICK = 'HandleTouchClick',
    LG_HANDLE_TOUCH_WHEEL = 'HandleTouchWheel',
    LG_HANDLE_CHANNEL_CHANGE = 'HandleChannelChange',
}

export enum LG_COMMAND {
    POWER = 1,
    NUMBER_0 = 2,
    NUMBER_1 = 3,
    NUMBER_2 = 4,
    NUMBER_3 = 5,
    NUMBER_4 = 6,
    NUMBER_5 = 7,
    NUMBER_6 = 8,
    NUMBER_7 = 9,
    NUMBER_8 = 10,
    NUMBER_9 = 11,
    UP = 12,
    DOWN = 13,
    LEFT = 14,
    RIGHT = 15,
    OK = 20,
    HOME_MENU = 21,
    BACK = 23,
    VOLUME_UP = 24,
    VOLUME_DOWN = 25,
    MUTE_TOGGLE = 26,
    CHANNEL_UP = 27,
    CHANNEL_DOWN = 28,
    BLUE = 29,
    GREEN = 30,
    RED = 31,
    YELLOW = 32,
    PLAY = 33,
    PAUSE = 34,
    STOP = 35,
    FAST_FORWARD = 36,
    REWIND = 37,
    SKIP_FORWARD = 38,
    SKIP_BACKWARD = 39,
    RECORD = 40,
    RECORDING_LIST = 41,
    REPEAT = 42,
    LIVE_TV = 43,
    EPG = 44,
    PROGRAM_INFORMATION = 45,
    ASPECT_RATIO = 46,
    EXTERNAL_INPUT = 47,
    PIP_SECONDARY_VIDEO = 48,
    SHOW_SUBTITLE = 49,
    PROGRAM_LIST = 50,
    TELE_TEXT = 51,
    MARK = 52,
    VIDEO_3D = 400,
    LR_3D = 401,
    DASH = 402,
    PREVIOUS_CHANNEL = 403,
    FAVORITE_CHANNEL = 404,
    QUICK_MENU = 405,
    TEXT_OPTION = 406,
    AUDIO_DESCRIPTION = 407,
    ENERGY_SAVING = 409,
    AV_MODE = 410,
    SIMPLINK = 411,
    EXIT = 412,
    RESERVATION_PROGRAM_LIST = 413,
    PIP_CHANNEL_UP = 414,
    PIP_CHANNEL_DOWN = 415,
    SWITCH_VIDEO = 416,
    APPS = 417,
}

export enum LG_QUERY {
    CUR_CHANNEL = 'cur_channel',
    CHANNEL_LIST = 'channel_list',
    CONTEXT_UI = 'context_ui',
    VOLUME_INFO = 'volume_info',
    SCREEN_IMAGE = 'screen_image',
    IS_3D = 'is_3d',
}

export interface Channel {
    chtype: string; // terrestrial
    sourceIndex: string; // '1'
    physicalNum: string; // '25'
    major: string; // '41'
    minor: string; // '65535'

    displayMajor?: string;
    displayMinor?: string;
    chname?: string;
    progName?: string;
    audioCh?: string;
    inputSourceName?: string;
    inputSourceType?: string;
    labelName?: string;
    inputSourceIdx?: string;
}

const removeJsonTextAttribute = function (value, parentElement) {
    try {
        const parentOfParent = parentElement._parent;
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
            const arr = arrOfKey;
            const arrIndex = arrOfKey.length - 1;
            arr[arrIndex] = value;
        } else {
            parentElement._parent[keyName] = value;
        }
    } catch (e) {}
};

const xml_options = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute,
};

/**
 * Options for the NetcastClient
 */
interface Options {
    timeout: number;
}

/**
 * Client to interact with necast TVs
 * host has to include a valid port number. By default LG TVs use 8080 so make sure to specify that
 * eg. 192.168.1.3:8080
 *
 * Following options are supported:
 * ```
 * interface Options {
 *   timeout: 2000;
 * }
 * ```
 */
export class NetcastClient {
    host: string;
    options: Options;

    /**
     * Creates a new NetcastClient instance
     *
     * @class      ClassName NetcastClient
     * @param      {string}  host     The host
     * @param      {2000}    options  The options
     */
    constructor(host: string, options: Options = { timeout: 2000 }) {
        this.host = host;
        this.options = options;
    }

    /**
     * Wraps the given command into an XML block ready to send to the TV
     *
     * @param      {LG_HANDLE}  command_type  LG_HANDLE
     * @param      {Channel}    command       either a LG_COMMAND or other
     *                                        payload, such as Channel
     * @param      {string}     session       the current session id. if not
     *                                        specified, the command will be
     *                                        unauthenticated
     */
    wrap_command(command_type: LG_HANDLE, command: LG_COMMAND | Channel, session = null) {
        return convert.js2xml(
            {
                command: {
                    session: session,
                    type: command_type,
                    value: command,
                },
            },
            { compact: true }
        );
    }

    /**
     * Sends the given message to the TV. message has to be in XML format Will
     * return a javascript object with the result, or throw an exception
     *
     * @param      {string}  message_type  Type of the message to send, eg
     *                                     'data', 'command', 'auth'
     * @param      {string}  message       Message to send in XML string format
     * @param      {object}  payload       Payload & (GET) parameters to send
     */
    async send_to_tv(message_type, message = null, payload = null): Promise<object> {
        const request_url = new URL(`http://${this.host}/roap/api/` + message_type);
        let res;
        try {
            if (message !== null) {
                // get_session(undefined);
                res = await fetch(request_url, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/atom+xml',
                    },
                    body: message,
                    signal: timeout_signal(this.options.timeout),
                });
            } else {
                Object.keys(payload).forEach((key) => request_url.searchParams.append(key, payload[key]));
                res = await fetch(request_url, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/atom+xml',
                    },
                    signal: timeout_signal(this.options.timeout),
                });
            }
        } catch (error) {
            if (error.message === 'The user aborted a request.') {
                throw new Error('Request timed out');
            }

            throw error;
        }

        const parsed: any = convert.xml2js(await res.text(), xml_options);
        if (parsed.envelope.ROAPError !== '200') {
            throw new Error(parsed.envelope.ROAPError);
        }

        return parsed.envelope;
    }

    /**
     * Issues a command to the TV to display the pair code // access token
     */
    async display_pair_code() {
        return this.send_to_tv(
            'auth',
            convert.js2xml(
                {
                    auth: {
                        type: 'AuthKeyReq',
                    },
                },
                { compact: true }
            )
        );
    }

    /**
     * Retrieves (or creates) the current session used for interacting with the
     * TV
     *
     * @param      {string}  access_token  Access token aka pair code
     */
    async get_session(access_token = null): Promise<string> {
        if (access_token === null) {
            this.display_pair_code();
            throw new Error('no access token specified. displaying pair key');
        }

        const authcmd = convert.js2xml(
            {
                auth: {
                    type: 'AuthReq',
                    value: access_token,
                },
            },
            { compact: true }
        );

        const res: any = await this.send_to_tv('auth', authcmd);
        return res.session;
    }

    /**
     * Issues a query command to the TV to retrieve current information such as
     * channel, volume, etc
     *
     * @param      {LG_QUERY}  query   What to query. See LG_QUERY type
     */
    async query_data(query: LG_QUERY) {
        const payload = { target: query };
        return this.send_to_tv('data', null, payload);
    }

    /**
     * Sends the given command to the TV To issue commands, you need a valid
     * session id. To retrieve that, use `get_session()` paired with the
     * access_token of the TV To get the access_token, use `display_pair_code()`
     *
     * @param      {LG_COMMAND}  command  The command to send, see LG_COMMAND
     *                                    type
     * @param      {string}      session  Session id
     */
    async send_command(command: LG_COMMAND, session: string) {
        const xmlcmd = this.wrap_command(LG_HANDLE.LG_HANDLE_KEY_INPUT, command, session);
        console.log(xmlcmd);
        return this.send_to_tv('command', xmlcmd);
    }

    /**
     * Changes channel to the given channel
     *
     * @param      {Channel}  channel  The channel to switch to. Has to be in a
     *                                 specific format, see Channel type
     * @param      {string}   session  Session id
     */
    async change_channel(channel: Channel, session: string) {
        const xmlcmd = this.wrap_command(LG_HANDLE.LG_HANDLE_CHANNEL_CHANGE, channel, session);
        console.log(xmlcmd);
        return this.send_to_tv('command', xmlcmd);
    }

    /**
     * Retrieves the current channel information from the TV
     *
     * @param      {string}  session  The session
     */
    async get_current_channel(session: string): Promise<Channel> {
        const res: any = await this.query_data(LG_QUERY.CUR_CHANNEL);
        return res.data;
    }
}
