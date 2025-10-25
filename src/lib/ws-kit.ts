import { ChannelManager } from './channel-manager';
import { isFunction } from './utils';
import type Pusher from 'pusher-js';
import type {
    ChannelTypeMap,
    DefaultChannels,
    ChannelRegistry,
    Logger,
    WsKitOptions,
} from './types';

export class WsKit {
    pusher: Pusher;
    channelManager: ChannelManager;
    logger: Logger;

    constructor(pusher: Pusher, options: WsKitOptions = {}) {
        this.pusher = pusher;

        this.channelManager = new ChannelManager(this);

        this.logger = isFunction(options.logger) ? options.logger : () => null;
    }

    public subscribe<
        K extends keyof ChannelRegistry,
        T extends keyof ChannelTypeMap<K> = 'public',
    >(
        name: K,
        options: { type: T } & Pick<
            Extract<DefaultChannels[K], { type: T }>,
            'type' | 'params'
        >
    ): ChannelTypeMap<K>[T] {
        return this.channelManager.subscribe(name, options) as ChannelTypeMap<K>[T];
    }
}
