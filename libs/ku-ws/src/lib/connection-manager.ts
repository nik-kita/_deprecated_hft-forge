import {Injectable} from "@nestjs/common";
import {KuHttpService} from "@project/ku-http";
import {WebSocket} from "ws";
import {qsFromObj} from "@project/utils";
import {KuWs} from "@project/types/ku";
import {SubscriptionManager} from "./subscription-manager";

@Injectable()
export class ConnectionManager {
  private ws?: WebSocket;
  constructor(private http: KuHttpService) {}

  async connect() {
    const { endpoint, token, pingTimeout, pingInterval } = await this.http.POST_apply_private_connect_token();

    if (this.ws) {
      await this.disconnect();
    }

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${endpoint}?${qsFromObj({ token, id: Date.now() })}`);

      this.ws = ws;
      ws.once('error', reject);
      ws.once('message', (welcome) => {
        const jWelcome = JSON.parse(welcome.toString()) as KuWs['WELCOME']['SUB']['PAYLOAD'];

        if (jWelcome.type !== 'welcome') { // TODO write tests and rm this check
          throw new Error();
        }

        resolve(new SubscriptionManager(ws));
      });
    });
  }

  async disconnect() {
    if (this.ws) { // TODO add more strict check for different "readyState" values
      return new Promise((resolve, reject) => {
        this.ws!.once('error', reject);
        this.ws!.on('close', resolve);

        this.ws!.close();
      });
    }
  }
}
