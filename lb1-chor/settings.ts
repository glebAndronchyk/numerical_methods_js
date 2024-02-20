import { memoize } from "../global_settings";

export const interval: [number, number] = [-Math.PI / 2, Math.PI / 2];
// export const interval: [number, number] = [-0, 5 * Math.PI];

export const epsilon = 0.01;
export const dotsAmount = 10;
export const fn = memoize<number, number>((x: number) => Math.cos(Math.sin(Math.pow(x, 3))) - 0.7);
// export const fn = memoize<number, number>((x: number) => 1.5 - Math.pow(x,1 - Math.cos(x)));
export const chordFn = memoize<number, number>((a: number, b: number) => a - fn(a) * ((b - a) / (fn(b) - fn(a))));
