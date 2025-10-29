import { SubChannel } from '../sub-channel';
import type { MasterChannel } from '../master-channel';
import { DefaultChannels, Member } from '../types';
import type { WsKit } from '../ws-kit';

export class PresenceChannel<
  C extends keyof DefaultChannels,
> extends SubChannel<C, 'presence'> {
  constructor(client: WsKit, masterChannel: MasterChannel) {
    super(client, masterChannel);
  }

  /**
   * Executed immediately once the channel is joined successfully, and will receive an array
   * containing the user information for all of the other users currently subscribed to the channel.
   */
  here(callback: (members: Member[]) => void) {
    this.on('pusher:subscription_succeeded', (data: Record<any, any>) => {
      callback(Object.keys(data.members).map((k) => data.members[k]));
    });
  }

  /**
   * Event whenever a new user subscribes to a presence channel.
   */
  joining(callback: (member: Member) => void) {
    this.on('pusher:member_added', (member: Record<any, any>) => {
      callback(member.info);
    });
  }

  /**
   * Event whenever a user unsubscribes from a presence channel.
   */
  leaving(callback: (member: Member) => void) {
    this.on('pusher:member_removed', (member: Record<any, any>) => {
      callback(member.info);
    });
  }
}
