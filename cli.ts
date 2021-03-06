#!/usr/bin/env node
import { NetcastClient } from './netcast';
import flags from 'flags';

flags.defineString('host', '192.168.1.1:8080', 'Host of the TV');
flags.defineInteger('access_token', '123456', 'Pair code of the TV');
flags.defineString('command', 'current_channel', 'command to issue');

flags.parse();

const command_mapping = {
    current_channel: async () => {
        console.log('Querying current channel');
        const client = new NetcastClient(flags.get('host'));

        try {
            const session = await client.get_session(flags.get('access_token'));
            console.log(await client.get_current_channel(session));
        } catch (error) {
            console.log('Error from TV: ', error);
        }

        process.exit(0);
    },
    help: () => {
        console.log('Help');
    },
};

const command = flags.get('command');
if (Object.keys(command_mapping).indexOf(command) === -1) {
    console.log('Command ' + command + ' not supported. Available commands:');
    console.log(Object.keys(command_mapping));
    process.exit(0);
}

command_mapping[command]();
