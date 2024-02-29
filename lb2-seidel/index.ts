import {epsilon, FIRST_ITERATION_COEFFICIENTS, INITIAL_MATRIX} from "./settings";

const getInitialEquations = (matrix: number[][]) => {
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

const equations = getInitialEquations(INITIAL_MATRIX);

const iterate = (coefficients: number[]): number[] => {

  let accuracyCount = 0;

  equations.forEach((eq, index) => {
    const coefsCopy =  [...coefficients];
    coefsCopy[index] = null;

    const result = eq(...coefsCopy)

    if (result <= epsilon) {
      accuracyCount++;
    }

    coefficients[index] = result;
  });

  if (accuracyCount === equations.length) {
    return coefficients;
  }

  return iterate(coefficients);
}

iterate(FIRST_ITERATION_COEFFICIENTS);
