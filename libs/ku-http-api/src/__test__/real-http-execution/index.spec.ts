import { describePortal } from '@hft-forge/utils';
import { describe_full_order_book_request } from './ku-req.full-order-book.describe';

describe('Test real KuCoin http execution', () => {
    describePortal(
        describe_full_order_book_request,
        'Check /api/v3/market/orderbook/level2 endpoint',
        () => ({}),
    );
});
