# WebSocketKit

WebSocketKit is a strongly-typed abstraction layer for managing WebSocket-based pub/sub communication (e.g. via Pusher) with full TypeScript support.

It’s built as a modern, more type safe alternative for **Laravel Echo**, designed with frontend frameworks in mind — especially **React**.

---

## Why WebSocketKit?

In modern applications — particularly with component-driven frameworks like **React** — real-time event management can become messy:

- Re-subscribing in nested components
- Risk of global disconnects
- Prop-drilling event handlers

**Laravel Echo**, for example, calls `leave()` globally — so if one component unsubscribes, **the entire app** loses the channel, even if other components are still listening.

---

**WebSocketKit** fixes this by tracking all event listeners internally:

> 🔁 Channels are only disconnected once **all listeners are removed**.  
> 🧠 You can safely subscribe in many places and dispose individually — only the last `.dispose()` will truly clean up the connection.
> ⚛️ Perfect for frameworks like React, where subscriptions are created/destroyed dynamically in `useEffect`.
> ⚛️ Works beautifully with custom hooks - allowing you to encapsulate event logic cleanly and reuse it across components.

# Define Your Channels

Start by extending the `ChannelRegistry` interface to declare the structure of your channels and events.

```ts

type FileDownloadReadyEvent = {
    notificationId: string;
    file: {
        name: string;
        url: string;
        //...
    }
    ts: string;
}

declare module 'websocketkit' {
  interface ChannelRegistry {
    'users.$userId.notifications': {
      type: 'private';
      params: {
        userId: number;
      };
      events: {
        fileDownloadReady: FileDownloadReadyEvent
      };
    };
  }
}
```

# Create an Instance

You can create a `WsKit` instance by passing a Pusher client.

```ts
const pusher = new Pusher();
const wskit = new WsKit(pusher);
```

# Subscribe to a Channel

Use `subscribe` to connect to a specific channel with parameters.

```ts
const sub = wskit.subscribe('users.$userId.notifications', { 
  type: 'private', 
  params: { userId } 
})
```

# Listen for Events

Use on to listen for typed events on a subscription.

```ts
sub.on('fileDownloadReady', ({ file }) => {
    console.log(file.name)
});
```

# Dispose Listeners

To clean up all listeners and unsubscribe from the channel, use `dispose()`:

```ts
sub.dispose()
```