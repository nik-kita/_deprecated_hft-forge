# ku-ws

* [`ConnectionManager`](./src/lib/connection-manager.ts)
  > This class provide functional to manage core socket events such /connect/ or /disconnect/
* [`SubscriptionManager`](./src/lib/subscription-manager.ts)
  > Provide control over the subscription (especially explore its state)
  * Under the hood it contains separate more concrete manager for each subscription type:
    * [`Level2_subscription_manager`](./src/lib/level2.subscription-manager.ts)
      > Provide control over the /level2/ channel (orderBook)
* [`MessageHandler`](./src/lib/message-handler.ts)
  1. Client explicitly API:
     > Provide functionality by adding or removing callbacks for special events
  2. NonClient, auto, implicitly API:
    > Under the hood this class contains methods that dynamically are called by received messages
* [`KuWsModule`](./src/lib/ku-ws.module.ts)
  > Standard Nest.js module

---

## The order of their composition

1. Create instance of `ConnectionManager`
2. `connectionManager.connect()` will return instance of `SubscriptionManager`
3. `SubscriptionManager` has methods that represents subscription that is possible to create by them
4. `.getMessageHandler()` method of `SubscriptionManager` return `MessageHandler` instance
5. `.addHandler(channel, cb)` method of `MessageHandler` allow you to add callback for message received in this channel
   * you may add many callbacks for the same message, they will invoked one by one
   * you may remove them (`.addHandler()` return id by wich is possible to remove it... API like `setTimeout`)

> You may get MessageHandler and add callbacks before subscriptions
