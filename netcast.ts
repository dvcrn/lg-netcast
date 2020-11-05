// Inspired by https://github.com/wokar/pylgnetcast
import convert, { ElementCompact } from 'xml-js';
import fetch from "node-fetch";

enum LG_HANDLE {
    LG_HANDLE_KEY_INPUT = 'HandleKeyInput',
    LG_HANDLE_MOUSE_MOVE = 'HandleTouchMove',
    LG_HANDLE_MOUSE_CLICK = 'HandleTouchClick',
    LG_HANDLE_TOUCH_WHEEL = 'HandleTouchWheel',
    LG_HANDLE_CHANNEL_CHANGE = 'HandleChannelChange'
}

enum LG_COMMAND {
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
    APPS = 417
}

enum LG_QUERY {
    CUR_CHANNEL = 'cur_channel',
    CHANNEL_LIST = 'channel_list',
    CONTEXT_UI = 'context_ui',
    VOLUME_INFO = 'volume_info',
    SCREEN_IMAGE = 'screen_image',
    IS_3D = 'is_3d',
}

interface Channel {
    chtype: string; // terrestrial
    sourceIndex: string; // '1'
    physicalNum: string; // '25'
    major: string; // '41'
    minor: string; // '65535'

    displayMajor?: string,
    displayMinor?: string,
    chname?: string,
    progName?: string,
    audioCh?: string,
    inputSourceName?: string,
    inputSourceType?: string,
    labelName?: string,
    inputSourceIdx?: string,
}

const payload = { 'target': 'volume_info' }
const url = "http://192.168.1.6:8080/roap/api/"

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
    } catch (e) { }
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
    textFn: removeJsonTextAttribute
};

class NetcastClient {
    host: string;

    constructor(host: string) {
        this.host = host;
    }

    // Wraps the given LG_COMMAND into an XML block ready to send to the TV 
    wrap_command(command_type: LG_HANDLE, command: LG_COMMAND | Channel, session = null) {
        return convert.js2xml({
            command: {
                session: session,
                type: command_type,
                value: command,
            },
        }, { compact: true });
    };

    async send_to_tv(message_type, message = null, payload = null) {
        const request_url = new URL(url + message_type);
        let res;
        if (message !== null) {
            // get_session(undefined);
            res = await fetch(request_url, {
                method: 'post',
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                body: message,
            });
        } else {
            Object.keys(payload).forEach(key => request_url.searchParams.append(key, payload[key]));
            res = await fetch(request_url, {
                method: 'get',
                headers: {
                    "Content-Type": "application/atom+xml",
                },
            });
        }

        const parsed: any = convert.xml2js(await res.text(), xml_options);
        if (parsed.envelope.ROAPError !== '200') {
            throw new Error(parsed.envelope.ROAPError);
        }


        return parsed.envelope;
    };

    // Sends a request to the TV to display the pair code // access token
    async display_pair_code() {
        return this.send_to_tv('auth', convert.js2xml({
            auth: {
                type: "AuthKeyReq"
            }
        }, { compact: true }));
    };

    // Creates a session with the TV and returns the session ID
    // If access_token is null, will display the pairing key instead
    async get_session(access_token = null): Promise<string> {
        if (access_token === null) {
            this.display_pair_code();
            throw new Error("no access token specified. displaying pair key");
        }

        const authcmd = convert.js2xml({
            auth: {
                type: 'AuthReq',
                value: access_token,
            }
        }, { compact: true });

        const res = await this.send_to_tv("auth", authcmd);
        return res.session;
    };

    // Queries the TV with the given query command
    async query_data(query: LG_QUERY) {
        const payload = { 'target': query };
        return this.send_to_tv("data", null, payload);
    };

    // Sends the given command to the TV
    // To issue commands, you need a valid session id. To retrieve that, use `get_session()` paired with the access_token of the TV
    // To get the access_token, use `display_pair_code()`
    async send_command(command: LG_COMMAND, session: string) {
        const xmlcmd = this.wrap_command(LG_HANDLE.LG_HANDLE_KEY_INPUT, command, session);
        console.log(xmlcmd);
        return this.send_to_tv('command', xmlcmd);
    };

    // Changes channel to the given channel
    // channel has to be a valid channel object 
    async change_channel(channel: Channel, session: string) {
        const xmlcmd = this.wrap_command(LG_HANDLE.LG_HANDLE_CHANNEL_CHANGE, channel, session);
        console.log(xmlcmd);
        return this.send_to_tv('command', xmlcmd);
    }

    // Retrieves current channel information
    async get_current_channel(session: string): Promise<Channel> {
        return await this.query_data(LG_QUERY.CUR_CHANNEL)
    }
}