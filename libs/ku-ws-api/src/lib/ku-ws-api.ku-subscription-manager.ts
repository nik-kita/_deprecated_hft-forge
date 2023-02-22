import { CurrencyPair } from '@hft-forge/types/ku/common';
import { Channel, KuPub } from '@hft-forge/types/ku/ws';


type _InitOptions<T extends Channel> = {
    private?: KuPub<T>
}

type SubscriptionStatus =
    | "inactive"
    | "pending"
    | "active"
    | "changing"
    | "unsubscribing"
    | "unsubscribed";


export class KuSubscriptionManager {
    // public static init({
    //     id
    // }: _InitOptions) {
    //     KuSubscriptionManager.subscriptions.set(id, );
    // }

    // private static subscriptions = new Map<string, KuSubscriptionManager & { status : SubscriptionStatus }>();

    // private constructor(id: string) {

    // }


}
