import type Pusher from 'pusher-js';
import { MasterChannel } from './master-channel';
import { PublicChannel } from './channels/public';
import { PrivateChannel } from './channels/private';
import { PresenceChannel } from './channels/presence';
import type { ChannelDefinition, ChannelTypeMap, LogLevel } from './types';
import type { WsKit } from './ws-kit';

export class ChannelManager {
    _client: WsKit;

    pusher: Pusher;

    channels: Map<string, MasterChannel> = new Map();

    constructor(client: WsKit) {
        this._client = client;

        this.pusher = this._client.pusher;
    }

    subscribe<T extends keyof ChannelTypeMap>(
        name: string,
        options: Pick<ChannelDefinition, 'type' | 'params'>
    ): ChannelTypeMap[T] {
        const channelName = this.getChannelNameByType(
            name,
            options.type,
            options.params
        );

        const channel = this.channels.get(channelName);
        if (!channel) {
            const masterChannel = new MasterChannel(this._client, channelName);
            this.channels.set(channelName, masterChannel);

            return this.createSubChannel(masterChannel, options.type);
        } else {
            return this.createSubChannel(channel, options.type);
        }
    }

    unsubscribe(name: string) {
        const channel = this.channels.get(name);
        if (channel) {
            this.channels.delete(name);
        }
    }

    private createSubChannel<T extends keyof ChannelTypeMap>(
        masterChannel: MasterChannel,
        type: 'public' | 'private' | 'presence'
    ): ChannelTypeMap[T] {
        switch (type) {
            case 'public':
                return new PublicChannel(
                    this._client,
                    masterChannel
                ) as ChannelTypeMap[T];
            case 'private':
                return new PrivateChannel(
                    this._client,
                    masterChannel
                ) as ChannelTypeMap[T];
            case 'presence':
                return new PresenceChannel(
                    this._client,
                    masterChannel
                ) as ChannelTypeMap[T];
            default:
                throw new Error(`Unknown channel type: ${type}`);
        }
    }

    private getChannelNameByType(
        name: string,
        type: 'public' | 'private' | 'presence',
        params: Record<string, string | number>
    ) {
        let parsedName = name;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                const pattern = new RegExp(`\\$${k}`, 'g');

                parsedName = parsedName.replace(pattern, String(v));
            });
        }

        switch (type) {
            case 'public':
                return parsedName;
            case 'private':
                return 'private-' + parsedName;
            case 'presence':
                return 'presence-' + parsedName;
            default:
                throw new Error(`Unknown channel type: ${type}`);
        }
    }
}
