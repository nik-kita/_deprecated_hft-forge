import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {KuHttpModule, KuHttpService} from "@project/ku-http";
import { KuWsModule } from '../../lib/ku-ws.module';
import {NestFactory} from "@nestjs/core";
import {ConnectionManager} from "../../lib/connection-manager";
import {SubscriptionManager} from "../../lib/subscription-manager";
import {MessageHandler} from "../../lib/message-handler";
import {pause} from "@project/utils";
import {Level2_subscription_manager} from "../../lib/level2.subscription-manager";

describe('ku-ws | mvp | 000', () => {
  it('Should connect, subscribe, unsubscribe, disconnect', (done) => {
    @Module({
      imports: [ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `${__dirname}/.test.env`,
      }), KuWsModule],
    })
    class App {}

    const test = async () => {
      const app = await NestFactory.create(App, { logger: false });
      const connectionManager = app.get(ConnectionManager);

      expect(connectionManager).toBeInstanceOf(ConnectionManager);

      const subscriptionManager = await connectionManager.connect();

      expect(subscriptionManager).toBeInstanceOf(SubscriptionManager);

      const messageHandler = subscriptionManager.getMessageHandler();

      expect(messageHandler).toBeInstanceOf(MessageHandler);

      const cleaner = messageHandler.addHandler('LEVEL_2', (jData) => {
        console.log(jData);
      });

      expect(typeof cleaner).toBe('number');

      const level2 = subscriptionManager.LEVEL_2({
        topic_second_splitted_by_comma_part: ['BTC-USDT'],
        privateChannel: false,
        id: Date.now().toString(),
      });

      expect(level2).toBeInstanceOf(Level2_subscription_manager);

      await pause(3_000);

      level2.send({
        id: Date.now().toString(),
        privateChannel: false,
        type: 'unsubscribe',
        topic_second_splitted_by_comma_part: ['BTC-USDT'],
      });

      await pause(10_000);

      await connectionManager.disconnect();

      done();
    }

    test();
  }, 20_000);
});
