import { SubscribeMessage } from "@nestjs/websockets";

export function SubMessageLikeMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        SubscribeMessage(propertyKey)(target, propertyKey, descriptor);
    };
}
