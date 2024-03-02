import {A, B, epsilon, INITIAL_MATRIX, MAX_DISCREPANCY, INITIAL_COEFS, INITIAL_ITERATION_STATE} from "./settings";
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

const iterate = (equations: ((...args: number[]) => number)[], coefficients = INITIAL_COEFS, state = {...INITIAL_ITERATION_STATE}): number[] | null => {

  let accuracyCount = 0;

  equations.forEach((eq, index) => {
    const coefsCopy =  [...coefficients];
    coefsCopy[index] = null;

    const result = eq(...coefsCopy);
    const absoluteDifference = Math.abs(coefficients[index] - result);
    const prevAbsoluteDifference = state.prevAbsoluteDifferences[index];

    if (absoluteDifference <= epsilon) {
      accuracyCount++;
    } else if (prevAbsoluteDifference && prevAbsoluteDifference <= absoluteDifference) {
      state.totalDiscrepancy++;
    }

    state.prevAbsoluteDifferences[index] = absoluteDifference;
    coefficients[index] = result;
  });

  if (state.totalDiscrepancy >= MAX_DISCREPANCY) {
    return null;
  }

  if (accuracyCount === equations.length) {
    return coefficients;
  }

  return iterate(equations, coefficients, state);
}

const getNormalizedMatrix = () => {
  const transposedA = transpose(A);

  const normalizedA = multiply(transposedA, A);
  const normalizedB = multiply(transposedA, B);

  return normalizedA.map((row, i) => [...row, ...normalizedB[i]]);
}

const clarify = () => {
  const equations = getEquations(INITIAL_MATRIX);

  const firstIteration = iterate(equations);

  if (!firstIteration) {
    const normalizedMatrix = getNormalizedMatrix();
    const normalizedEquations = getEquations(normalizedMatrix)

    return iterate(normalizedEquations);
  }

  return firstIteration;
}

console.log(clarify());
