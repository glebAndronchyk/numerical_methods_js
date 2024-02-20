import { fn, dotsAmount, epsilon, chordFn } from './settings';
import { calculateStep } from "../global_settings";

export const getCalculationsArrays = (a: number, b: number, step: number) => {
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

export const getClarificationIntervals = (xArr: number[], yArr: number[]) => {
  const intermediateRoots: number[] = [];

  const clarificationIntervals = yArr.reduce<[number, number][]>((acc, y, index) => {
    if (yArr[index - 1] * y < 0) {
      // When function changes sign => interval should be clarified by chord method
      const x2 = chordFn(xArr[index - 1], xArr[index]);

      // If function result is close enough => one solution found
      if (Math.abs(fn(x2)) <= epsilon) {
        intermediateRoots.push(x2);
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

  return {intermediateRoots, clarificationIntervals};
}

export const clarifyRootsByChord = (startIntervals: [number, number][]) => {
  const initialDots: number[][] = [];
  const roots: number[] = [];

   const clarify = (intervals: typeof startIntervals, level = 0) => {
     intervals.forEach(([a, b]) => {
       const step = calculateStep([a, b], dotsAmount);

       const {xArr, yArr} = getCalculationsArrays(a, b, step);
       if (level === 0) {
         initialDots.push(...xArr.map((n, index) => {
           return [n, yArr[index]];
         }));
       }

       const {intermediateRoots, clarificationIntervals} = getClarificationIntervals(xArr, yArr);
       roots.push(...intermediateRoots);

       // Recursively find other solutions
       clarificationIntervals.length && clarify(clarificationIntervals, level + 1);
     });
   }

   clarify(startIntervals);

    return {initialDots, roots: roots.map(root => +Number(root).toFixed(7))};
}

// clarifyRootsByChord([interval]);
// console.log(result);
