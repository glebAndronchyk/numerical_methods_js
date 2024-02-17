import { fn, interval, dotsAmount, epsilon, chordFn } from './settings';
import { calculateStep } from "../global_settings";

const result: number[] = [];

const clarifyRootsByChord = (intervals: [number, number][]) => {
  return intervals.map(([a, b]) => {
    const step = calculateStep([a, b], dotsAmount);

    const xArr = Array.from({length: dotsAmount}).reduce<number[]>((acc, _, index) => {
      if (index === 0) {
        return acc;
      }

      if (index === dotsAmount - 1) {
        return [...acc, b];
      }

      return [...acc, acc[index - 1] + step];
    }, [a]);


    const yArr = xArr.slice(0).reduce<number[]>((acc, y) => [...acc, fn(y)], []);

    const intervalsForClarification = yArr.reduce<[number, number][]>((acc, y, index) => {
      if (yArr[index - 1] * y < 0) {
        const x2 = chordFn(xArr[index - 1], xArr[index]);

        if (Math.abs(fn(x2)) <= epsilon) {
          result.push(x2);
          return acc;
        }

        return [
          ...acc,
          [xArr[index - 1], x2],
          [x2, xArr[index]]
        ];
      }

      return acc;
    }, []);

    return clarifyRootsByChord(intervalsForClarification);
  });
}

clarifyRootsByChord([interval]);
console.log(result);
