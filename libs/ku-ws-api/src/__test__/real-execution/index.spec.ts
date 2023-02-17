import { describePortal } from '@hft-forge/utils';
import { describe_ku_ws_subscribe_welcome } from './welcome.describe';


describe('Check Kucoin subscription channels', () => {
  describePortal(
    describe_ku_ws_subscribe_welcome,
    'Should subscribe and receive "welcome" in "type" property of response',
    () => ({}),
  );
});
