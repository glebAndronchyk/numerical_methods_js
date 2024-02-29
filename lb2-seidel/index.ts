import {A, B, epsilon, INITIAL_MATRIX, MAX_D, startCoefs} from "./settings";
import {
  transpose,
  multiply
} from 'mathjs'

const getEquations = (matrix: number[][]) => {
  return matrix.map((row) => {
    const values = row.slice(0, row.length - 1);
    const b = row.at(-1);

    return (...coefficients: (number | null)[]) => {

      if (coefficients.length !== values.length) {
        throw new Error("Length of coefficients array is incorrect");
      }

      let denominator;
      const numerator = b + coefficients.reduce((acc, n, index) => {
        const val =  values[index];

        if (n) {
          return acc + -val * n;
        }

        denominator = val;
        return acc;
      }, 0)

      return numerator / denominator;
    }
  });
}

let d = 0;

const iterate = (coefficients: number[], equations: ((...args: number[]) => number)[]): number[] | null => {

  let accuracyCount = 0;

  equations.forEach((eq, index) => {
    const coefsCopy =  [...coefficients];
    coefsCopy[index] = null;

    const result = eq(...coefsCopy)

    if (Math.abs(coefficients[index] - result) <= epsilon) {
      accuracyCount++;
    } else if (coefficients[index] <= result) {
      d++;
    }

    coefficients[index] = result;
  });

  if (d >= MAX_D) {
    return null;
  }

  if (accuracyCount === equations.length) {
    return coefficients;
  }

  return iterate(coefficients, equations);
}

const getNormalizedMatrix = () => {
  const transposedA = transpose(A);

  const normalizedA = multiply(transposedA, A);
  const normalizedB = multiply(transposedA, B);

  return normalizedA.map((row, i) => [...row, ...normalizedB[i]]);
}

const clarify = () => {
  const equations = getEquations(INITIAL_MATRIX);

  const firstIteration = iterate(startCoefs, equations);

  if (!firstIteration) {
    d = 0;
    const normalizedMatrix = getNormalizedMatrix();
    const normalizedEquations = getEquations(normalizedMatrix)

    return iterate(startCoefs, normalizedEquations);
  }

  return firstIteration;
}

console.log(clarify());
