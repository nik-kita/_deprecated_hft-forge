export function describePortal<D, T extends (
    name: string,
    getContext?: () => object,
) => D>(
    name: string,
    portal: T,
    liftContext: Parameters<T>[1],
) {
    return portal(name, liftContext) as D;
}
