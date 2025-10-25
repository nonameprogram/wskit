import { SubChannel } from '../sub-channel';
import type { MasterChannel } from '../master-channel';
import type{ DefaultChannels } from '../types';
import type { WsKit } from '../ws-kit';

export class PresenceChannel<
    C extends keyof DefaultChannels,
> extends SubChannel<C, 'presence'> {
  constructor(client: WsKit, masterChannel: MasterChannel) {
    super(client, masterChannel);
  }

  here(callback: CallableFunction) {
    this.on('pusher:subscription_succeeded', (data: Record<any, any>) => {
      callback(Object.keys(data.members).map((k) => data.members[k]));
    });
  }

  joining(callback: CallableFunction) {
    this.on('pusher:member_added', (member: Record<any, any>) => {
      callback(member.info);
    });
  }

  leaving(callback: CallableFunction) {
    this.on('pusher:member_removed', (member: Record<any, any>) => {
      callback(member.info);
    });
  }
}
