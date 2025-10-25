import { SubChannel } from '../sub-channel';
import type { MasterChannel } from '../master-channel';
import type { DefaultChannels } from '../types';
import type { WsKit } from '../ws-kit';

export class PublicChannel<
    C extends keyof DefaultChannels,
> extends SubChannel<C> {
    constructor(client: WsKit, masterChannel: MasterChannel) {
        super(client, masterChannel);
    }
}
