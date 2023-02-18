export type KuUnsubscribe<T extends {
    id: string,
    type: 'subscribe',
    response: boolean,
    topic: string,
}> = {
    id: string,
    type: 'unsubscribe',
    response: boolean,
    privateChannel: boolean,
    topic: T['topic'],
};
