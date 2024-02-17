export const calculateStep = ([a, b]: [number, number], dotsAmount: number) => (b - a) / dotsAmount;

const wrapper = (key: any[]) => key.join('|');

export const memoize = <A, R>(fn: (...args: A[]) => R) => {
  const cache = new Map<string, R>();

  return (...args: Parameters<typeof fn>) => {
    const key = wrapper(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }
}
