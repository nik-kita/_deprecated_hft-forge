export type DescribeInPortal<T = void> = (
    name: string,
    getContext?: () => unknown,
) => T;
