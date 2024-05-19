export class Metric {
    readonly startTime: number;

    constructor(private value: string) {
        this.startTime = performance.now();
    }

    attach(headers: Record<string, string>) {
        if (headers['Server-Timing'] === undefined)
            headers['Server-Timing'] = `${this.value};dur=${performance.now() - this.startTime}`;
        else
            headers['Server-Timing'] += `, ${this.value};dur=${performance.now() - this.startTime}`;
    }
}

export function metric(name: string, description?: string) {
    return new Metric(description === undefined ? name : `${name};desc=${description}`);
}
