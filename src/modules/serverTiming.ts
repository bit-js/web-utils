export class Metric {
    public readonly startTime: number;
    private readonly value: string;

    public constructor(value: string) {
        this.startTime = performance.now();
        this.value = value;
    }

    public attach(headers: string[][]): void {
        headers.push(['Server-Timing', this.value + (performance.now() - this.startTime)]);
    }

    public append(headers: Headers): void {
        headers.append('Server-Timing', this.value + (performance.now() - this.startTime));
    }
}

export function metric(name: string, description?: string): () => Metric {
    const value = description === undefined ? `${name};dur=` : `${name};desc=${description};dur=`;
    return () => new Metric(value);
}
