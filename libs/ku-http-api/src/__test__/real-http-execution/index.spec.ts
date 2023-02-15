import { describePortal } from '@hft-forge/utils';
import { KuReqService } from '../..';
import { describe_full_order_book_request } from './ku-req.full-order-book.describe';

describe(`${KuReqService.name} (if it possible - test real http execution)`, () => {
    describePortal(
        describe_full_order_book_request,
        'Check /api/v3/market/orderbook/level2 endpoint',
        () => ({}),
    );
});
