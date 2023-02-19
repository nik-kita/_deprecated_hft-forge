export function BindThis<T extends new (...args: any[]) => any>() {
    return (target: T) => class extends target {
        constructor(...args: any[]) {
            super(...args);

            Object.getOwnPropertyNames(target.prototype)
                .filter((property) => {
                    if (typeof (this as any)[property] !== 'function') return false;
                    if (property === 'constructor') return false;

                    return true;
                })
                .forEach((method) => {
                    (this as any)[method] = (this as any)[method].bind(this);
                });
        }
    };
}
