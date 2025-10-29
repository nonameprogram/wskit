import { WsKit } from 'websocketkit';
import Pusher from 'pusher-js';

declare module 'websocketkit' {
  interface ChannelRegistry {
    'chats.$chatId': {
      type: 'presence';
      params: {
        chatId: string;
      };
      events: {
        messageSent: {
          userId: string;
          message: string;
          timestamp: string;
        };
      };
    };
  }
}

const pusher = new Pusher('TEST', { cluster: 'mt1' });
const wskit = new WsKit(pusher);

const sub = wskit.subscribe('chats.$chatId', {
  type: 'presence',
  params: { chatId: '1' },
});

sub.leaving((member) => {
  console.log(member);
});

sub.whisper('test', (member) => {
  console.log(member);
});
