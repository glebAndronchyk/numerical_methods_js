import { fn, interval, dotsAmount, epsilon, chordFn } from './settings';
import { calculateStep } from "../global_settings";

const result: number[] = [];

const getCalculationsArrays = (a: number, b: number, step: number) => {
  const yArr = [fn(a)];
  const xArr = Array.from({length: dotsAmount}).reduce<number[]>((acc, _, index) => {
    if (index === 0) {
      return acc;
    }

    if (index === dotsAmount - 1) {
      yArr.push(fn(b));
      return [...acc, b];
    }

    const x = acc[index - 1] + step;
    yArr.push(fn(x));
    return [...acc, x];
  }, [a]);

  return {yArr, xArr};
}

const getClarificationIntervals = (xArr: number[], yArr: number[]) => {
  return yArr.reduce<[number, number][]>((acc, y, index) => {
    if (yArr[index - 1] * y < 0) {
      // When function changes sign => interval should be clarified by chord method
      const x2 = chordFn(xArr[index - 1], xArr[index]);

      // If function result is close enough => one solution found
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
}

const clarifyRootsByChord = (intervals: [number, number][]) => {
  intervals.forEach(([a, b]) => {
    const step = calculateStep([a, b], dotsAmount);

    const {xArr, yArr} = getCalculationsArrays(a, b, step);

    const intervalsForClarification = getClarificationIntervals(xArr, yArr);

    // Recursively find other solutions
    intervalsForClarification.length && clarifyRootsByChord(intervalsForClarification);
  });
}

clarifyRootsByChord([interval]);
console.log(result);
