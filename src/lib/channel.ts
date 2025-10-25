import type { Channel as PrimitiveChannel } from 'pusher-js';
import type Pusher from 'pusher-js';
import type { ChannelManager } from './channel-manager';
import type { WsKit } from './ws-kit';
import type { LogLevel } from './types';

export abstract class Channel {
    _client: WsKit;

    sub!: PrimitiveChannel;

    name: string;

    pusher: Pusher;

    channelManager: ChannelManager;

    constructor(client: WsKit, name: string) {
        this._client = client;

        this.pusher = this._client.pusher;

        this.name = name;

        this.channelManager = this._client.channelManager;

        this.subscribe();
    }

    subscribe() {
        this.sub = this.pusher.subscribe(this.name);
    }

    unsubscribe() {
        this.pusher.unsubscribe(this.name);
    }

    _off(event?: string, callback?: CallableFunction) {
        this.sub.unbind(event, callback);
    }

    _on(event: string, callback: CallableFunction) {
        this.sub.bind(event, callback);
    }
}
