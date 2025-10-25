import { describe, expect, test, vi } from 'vitest';
import { WsKit } from '../src';
import Pusher from 'pusher-js';
// import { PusherMock } from 'pusher-js-mock';

// vi.mock("pusher-js", () => {
//   return {
//     __esModule: true,
//     default: require("pusher-js-mock").PusherMock
//   };
// });

test('subscribe to public channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  expect(sub).toBeDefined();

  expect(pusher.channels.find("test")).toBeDefined();
})

test('subscribe to private channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'private'});

  expect(sub).toBeDefined();

  // console.log(pusher.channels);

  expect(pusher.channels.find("private-test")).toBeDefined();
})

test('subscribe to presence channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'presence'});

  expect(sub).toBeDefined();

  expect(pusher.channels.find("presence-test")).toBeDefined();
})

test('listen for whisper', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.listenForWhisper('typing', callback);

  const channel = pusher.channels.find("test");

  channel.emit('client-typing', {});

  expect(callback).toHaveBeenCalled();
})

test('calls callback on event', () => {
    const pusher = new Pusher('TEST', {
      cluster: 'mt1'
    });
    const wskit = new WsKit(pusher);

    const sub = wskit.subscribe('test', {type: 'public'});

    const callback = vi.fn();

    sub.on('test', callback);

    const channel = pusher.channels.find("test");

    channel.emit('test', {});

    expect(callback).toHaveBeenCalled();
});

test('stop listening for whisper', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.listenForWhisper('typing', callback);

  sub.stopListeningForWhisper('typing');

  const channel = pusher.channels.find("test");

  channel.emit('client-typing', {});

  expect(callback).not.toHaveBeenCalled();
})

test('stop listening for event', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.on('test', callback);

  sub.off('test', callback);

  const channel = pusher.channels.find("test");

  channel.emit('test', {});

  expect(callback).not.toHaveBeenCalled();
})

test('listen for notification', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.notification(callback);

  const channel = pusher.channels.find("test");

  /**
   * Mock laravel notification.
   */
  channel.emit('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', {});

  expect(callback).toHaveBeenCalled();
})

test('listen for pusher subscription succeded', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.subscribed(callback);

  const channel = pusher.channels.find('test');

  channel.emit("pusher:subscription_succeeded")

  expect(callback).toHaveBeenCalled();
})

test('listen for pusher subscription error', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.error(callback);

  const channel = pusher.channels.find('test');

  channel.emit("pusher:subscription_error")

  expect(callback).toHaveBeenCalled();
})

test('stop listening for event by disposing subscription', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  /**
   * Create second subscription because `dispose` will leave channel before we emit event.
   */
  const sub2 = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.on('test', callback);

  sub.dispose();

  const channel = pusher.channels.find('test');

  channel.emit("test")

  expect(callback).not.toHaveBeenCalled();
})

test('dispose should unsub from pusher channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const callback = vi.fn();

  sub.on('test', callback);

  sub.dispose();

  expect(pusher.channels.find('test')).toBeUndefined();

  expect(wskit.channelManager.channels.has('test')).not.toBeTruthy();
})

test('listen for here event on presence channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'presence'});

  const callback = vi.fn();

  sub.here(callback);

  const channel = pusher.channels.find('presence-test');

  channel.emit("pusher:subscription_succeeded", {members: {'tester': {id: 1}}})

  expect(callback).toHaveBeenCalled();
})

test('listen for joining event on presence channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'presence'});

  const callback = vi.fn();

  sub.joining(callback);

  const channel = pusher.channels.find('presence-test');

  channel.emit("pusher:member_added", {'tester': {id: 1}})

  expect(callback).toHaveBeenCalled();
})

test('listen for leaving event on presence channel', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'presence'});

  const callback = vi.fn();

  sub.leaving(callback);

  const channel = pusher.channels.find('presence-test');

  channel.emit("pusher:member_removed", {'tester': {id: 1}})

  expect(callback).toHaveBeenCalled();
})

test('join channel with params', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  wskit.subscribe('test.$id', {type: 'public', params: {
    id: 1
  }});

  expect(pusher.channels.find('test.1')).toBeDefined();
})

test('unsub from event that was not subscribed', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  expect(() => sub.off('test')).not.toThrowError();
})

test('whisper to other users', () => {
  const pusher = new Pusher('TEST', {
    cluster: 'mt1'
  });
  const wskit = new WsKit(pusher);

  const sub = wskit.subscribe('test', {type: 'public'});

  const channel = pusher.channels.find('test');

  const mock = vi.spyOn(channel, 'trigger');

  sub.whisper('test', {});

  expect(mock).toHaveBeenCalled();
})