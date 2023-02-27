import { CurrencyPair } from '@hft-forge/types/ku/common';
import { Channel, KuPub } from '@hft-forge/types/ku/ws';


export class Level2_SubscriptionManager {
    state: {
        id: `LEVEL_2::${number}`,
        channel: KuPub<Channel>['_PAYLOAD']['topic_first_part'],
        readonly privateTopics: Set<CurrencyPair>,
        readonly publicTopics: Set<CurrencyPair>,
        status: 'active' | 'pending' | 'inactive',
    } = {
        privateTopics: new Set(),
        publicTopics: new Set(),
    } as Level2_SubscriptionManager['state'];

    updates: (typeof this.state)[] = [];

    constructor(options: Omit<
        KuPub<'LEVEL_2'>['_PAYLOAD'], 'type'>
        & {
            type: 'subscribe',
            response: true,
        }) {
        const state = this.state;
        const {
            id,
            privateChannel,
            // response, => true
            topic_first_part,
            topic_second_splitted_by_comma_part,
            // type, => 'subscribe'
        } = options;

        state.channel = topic_first_part;
        state.id = id;
        state.status = 'pending';

        if (privateChannel) {
            topic_second_splitted_by_comma_part.forEach((cp) => void state.privateTopics.add(cp));
        } else {
            topic_second_splitted_by_comma_part.forEach((cp) => {
                state.privateTopics.add(cp);
                state.publicTopics.add(cp);
            });
        }
    }

    update(options: KuPub<'LEVEL_2'>['_PAYLOAD']) {
        const {
            privateChannel,
            topic_first_part,
            topic_second_splitted_by_comma_part,
            type,
        } = options;
        const nextState = structuredClone(this.state);

        if (type === 'subscribe') {
            if (privateChannel) {
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.privateTopics.add(cp));
            } else {
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.publicTopics.add(cp));
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.privateTopics.add(cp));
            }
        } else {
            if (privateChannel) {
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.privateTopics.delete(cp));
            } else {
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.publicTopics.delete(cp));
                topic_second_splitted_by_comma_part.forEach((cp) => void nextState.privateTopics.delete(cp));
            }
        }

        this.updates.push(nextState);
    }

    onAck() {
        const currentState = this.updates.pop();

        if (!currentState) {
            throw new Error('Unexpected .onAck() call. Updates not found');
        }

        this.state = currentState;
    }

    getState() {
        return {
            state: this.state,
            updates: this.updates,
        };
    }
}
