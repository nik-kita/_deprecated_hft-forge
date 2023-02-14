export class HftForgeError extends Error {
    details: { [key: string]: any };

    constructor(name: string, details: Record<string, any> = {}) {
        super(name);

        this.name = HftForgeError.name;
        // Object.setPrototypeOf(this, HftForgeError.prototype);

        this.details = details;
    }
}
