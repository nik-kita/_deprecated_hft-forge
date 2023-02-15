export function describePortal<D, T extends (
    name: string,
    getContext?: () => object,
) => D>(
    portal: T,
    name: Parameters<T>[0],
    liftContext: Parameters<T>[1],
) {
    return portal(name, liftContext) as D;
}
