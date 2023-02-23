import { CurrencyPair } from '@hft-forge/types/ku/common';
import { Channel, KuPub, PrivacyStatus, SubscriptionStatus } from '@hft-forge/types/ku/ws';
import { HftForgeError } from '@hft-forge/utils';


type _Options<T extends Channel> = Omit<KuPub<T>['_PAYLOAD'], 'channel'> & { channel: T };
type _InitOptions<T extends Channel> = Omit<_Options<T>, 'type'> & { type: 'subscribe' };


export class KuSubscriptionManager<T extends Channel> {
    public static init<T extends Channel>(options: _InitOptions<T>) {
        const { id } = options;
        const manager = new KuSubscriptionManager(options);

        KuSubscriptionManager._subscriptions.set(id, manager);
    }

    private static _subscriptions = new Map<string, KuSubscriptionManager<Channel>>();

    public static getById<T extends Channel>(id: `${T}::${number}`) {
        return KuSubscriptionManager._subscriptions.get(id) as KuSubscriptionManager<T> | undefined;
    }

    private id: string;
    private status: SubscriptionStatus;
    private privacyStatus: PrivacyStatus; // TODO check!
    private channel: Channel;
    // Empty obj for 'all', 1 - for topics, 0 - when unsubscribing after 'all'
    private topic: [CurrencyPair, ...CurrencyPair[]] | ['all'];
    private isIncludedTopic: boolean;

    private constructor(options: _InitOptions<T>) {
        const { id, topic_second_splitted_by_comma_part, privateChannel, channel } = options;

        this.id = id;
        // Constructor should be called only after first subscription request, so we are "pending"
        this.status = 'pending';
        // First time we may subscribe only to [public/private]-only updates
        this.privacyStatus = privateChannel ? 'private-only' : 'public-only';
        this.channel = channel;
        this.topic = topic_second_splitted_by_comma_part;
    }

    public updateByAck() {
        if (this.status === 'changing') {
            this.status = 'active';
        } else if (this.status === 'unsubscribing') {
            this.status = 'inactive';
        } else if (this.status === 'pending') {
            this.status = 'active';
        } else {
            throw new HftForgeError('Incorrect subscription status', {
                message: 'Not all "SubscriptionStatus" values are expected when "ack" message from server is received',
                currentStatus: this.status,
            });
        }
    }

    public updateByClient<T extends Channel>(options: _Options<T>) {
        const {
            privateChannel, topic_second_splitted_by_comma_part, type,
        } = options;


        if (privateChannel) {
            /**
             * PRIVATE = true
             */
            if (type === 'subscribe') {
                /**
                 * SUBSCRIBE
                 */

                if (topic_second_splitted_by_comma_part[0] === 'all') {
                    this.isIncludedTopic = true;
                    this.topic = topic_second_splitted_by_comma_part;
                } else if (this.topic[0] === 'all') {
                    if (this.isIncludedTopic) {
                        // this.topic still be ["all"]
                    } else {
                        this.isIncludedTopic = true;
                        this.topic = topic_second_splitted_by_comma_part;
                    }
                } else {
                    if (this.isIncludedTopic) {
                        this.topic.push(...topic_second_splitted_by_comma_part as CurrencyPair[]);
                    } else {
                        (this.topic as CurrencyPair[]) = this.topic.filter((t) => !topic_second_splitted_by_comma_part.includes(t));
                    }
                }

                if (this.privacyStatus === 'private-only') {
                    // nothing
                    this.status = 'changing';
                } else if (this.privacyStatus === 'public-only') {
                    this.privacyStatus = 'private-public';
                    this.status = 'changing';
                } else if (this.privacyStatus === 'none') {
                    this.privacyStatus = 'private-only';
                    this.status = 'changing';
                }
                // else means this.privacyStatus = 'private-public' - so nothing changed // TODO check it
            } else {
                /**
                 * UNSUBSCRIBE
                 */

                if (topic_second_splitted_by_comma_part[0] === 'all') {
                    this.isIncludedTopic = false;
                    this.topic = topic_second_splitted_by_comma_part;
                } else if (this.topic[0] === 'all') {
                    if (this.isIncludedTopic) {
                        this.topic = topic_second_splitted_by_comma_part;
                        this.isIncludedTopic = false;
                    } else {
                        // this.topic still be ["all"] (excluded)
                    }
                } else {
                    if (this.isIncludedTopic) {
                        (this.topic as CurrencyPair[]) = (this.topic as CurrencyPair[]).filter((t) => !topic_second_splitted_by_comma_part.includes(t));
                    } else {
                        this.topic.push(...(topic_second_splitted_by_comma_part as CurrencyPair[]));
                    }
                }


                if (this.privacyStatus === 'private-public') {
                    this.privacyStatus = 'public-only';
                    this.status = 'changing';
                } else if (this.privacyStatus === 'public-only') {
                    // still 'public-only'
                    this.status = 'changing';
                } else {
                    this.privacyStatus = 'none';
                    this.status = 'unsubscribing';
                }
            }
        } else {
            /**
             * PRIVATE = false
             */
            if (type === 'subscribe') {
                this.privacyStatus = 'private-public';
                this.status = 'changing';
            } else {
                this.privacyStatus = 'none'; // TODO check
                this.status = 'unsubscribing';
            }
        }
    }
}
