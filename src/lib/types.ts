import type { PublicChannel } from './channels/public';
import type { PrivateChannel } from './channels/private';
import type { PresenceChannel } from './channels/presence';

export type ChannelTypeMap<
  C extends keyof DefaultChannels = keyof DefaultChannels,
> = {
  public: PublicChannel<C>;
  private: PrivateChannel<C>;
  presence: PresenceChannel<C>;
};

export type ChannelDefinition = {
  type: keyof ChannelTypeMap;
  params: Record<string, string | number>;
  events: Record<string, any>;
  whispers: Record<string, any>;
};

export interface ChannelRegistry {}

export interface Register {
  channels: ChannelRegistry;
}

export type DefaultChannels = Register extends {
  channels: infer T;
}
  ? T
  : ChannelRegistry;

export type LogLevel = 'info' | 'error' | 'warn';

export type Logger = (
  logLevel: LogLevel,
  message: string,
  extraData?: Record<string, unknown>,
) => void;

export type WsKitOptions = {
  logger?: Logger;
};

export type Member = {
  id: string;
  info: Record<string, any>;
};
