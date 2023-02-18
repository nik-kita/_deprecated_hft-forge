import { DescribeInPortal } from '@hft-forge/types/common';


export function describePortal<D, T extends DescribeInPortal<D>>(
    portal: T,
    name: Parameters<T>[0],
    liftContext?: Parameters<T>[1],
) {
    return portal(name, liftContext) as D;
}
