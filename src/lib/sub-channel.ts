import type { MasterChannel } from './master-channel';
import type { ChannelTypeMap, DefaultChannels } from './types';
import type { WsKit } from './ws-kit';
import { nanoid } from 'nanoid/non-secure';

export abstract class SubChannel<
  C extends keyof DefaultChannels = keyof DefaultChannels,
  ChannelType extends keyof ChannelTypeMap<C> = 'public',
> {
  _client: WsKit;

  public _id: string;

  protected masterChannel: MasterChannel;

  protected listeners: Record<
    keyof Extract<DefaultChannels[C]['events'], { type: ChannelType }>,
    CallableFunction[]
  > = {} as any;

  protected constructor(client: WsKit, masterChannel: MasterChannel) {
    this._client = client;

    this.masterChannel = masterChannel;

    this._id = nanoid();

    this.masterChannel.register(this);
  }

  public off(
    event: keyof Extract<DefaultChannels[C]['events'], { type: ChannelType }>,
    callback?: CallableFunction,
  ) {
    if (!this.listeners[event]) return;

    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    } else {
      this.listeners[event] = [];
    }

    if (this.listeners[event].length === 0) {
      delete this.listeners[event];

      /**
       *  Notifies the master channel if all listeners are removed.
       */
      this.masterChannel.off(this, event as string);
    }
  }

  /**
   * Register event
   */
  public on<
    E extends keyof Extract<
      DefaultChannels[C],
      { type: ChannelType }
    >['events'],
  >(
    event: E,
    callback: (
      evt: Extract<DefaultChannels[C], { type: ChannelType }>['events'][E],
    ) => void,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];

      /**
       * Notifies the master channel when the first listener is added.
       */
      this.masterChannel.on(this, event as string);
    }

    this.listeners[event].push(callback);

    return () => this.off(event as string, callback);
  }

  public emit(event: string, payload: any) {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => callback(payload));
  }

  whisper<
    E extends keyof Extract<
      DefaultChannels[C],
      { type: ChannelType }
    >['whispers'],
  >(
    eventName: E,
    data: Extract<DefaultChannels[C], { type: ChannelType }>['whispers'][E],
  ) {
    /**
     * Client events must be prefixed by `client-`.
     * Events with any other prefix will be rejected by the Channels server
     */
    this.masterChannel.sub.trigger(`client-${String(eventName)}`, data);
  }

  listenForWhisper<
    E extends keyof Extract<
      DefaultChannels[C],
      { type: ChannelType }
    >['whispers'],
  >(
    event: E,
    callback: (
      evt: Extract<DefaultChannels[C], { type: ChannelType }>['whispers'][E],
    ) => void,
  ) {
    return this.on(('client-' + String(event)) as E, callback);
  }

  stopListeningForWhisper<
    E extends keyof Extract<
      DefaultChannels[C],
      { type: ChannelType }
    >['whispers'],
  >(
    eventName: E,
    callback?: (
      evt: Extract<DefaultChannels[C], { type: ChannelType }>['whispers'][E],
    ) => void,
  ) {
    return this.off('client-' + String(eventName), callback);
  }

  notification(callback: (notification: Record<string, any>) => void) {
    return this.on(
      '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
      callback,
    );
  }

  subscribed(callback: () => void): void {
    this.on('pusher:subscription_succeeded', callback);
  }

  error(callback: (error: Record<string, any>) => void): void {
    this.on('pusher:subscription_error', callback);
  }

  /**
   * Cleans up resources by removing all registered event listeners
   * and unregistering the current instance from the master channel.
   *
   * @return {void} Does not return a value.
   */
  dispose(): void {
    Object.entries(this.listeners).forEach(([event, callbacks]) => {
      callbacks.forEach((callback) => this.off(event as string, callback));
    });

    this.masterChannel.unregister(this);
  }
}
