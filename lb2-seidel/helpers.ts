import {Coefficient, Equation, Matrix} from "./types";
import {multiply, transpose} from "mathjs";

export const getEquations = (A: Matrix, B: Matrix): Equation[] => A.map((row, i) => {
  const b = B[i][0];

  return (...coefficients: Coefficient[]) => {

    if (coefficients.length !== row.length) {
      throw new Error("Length of coefficients array is incorrect");
    }

    let denominator;
    const numerator = b + coefficients.reduce((acc, n, index) => {
      const val = row[index];

      if (n) {
        return acc + -val * n;
      }

      denominator = val;
      return acc;
    }, 0);

    return numerator / denominator;
  }
});

export const getNormalizedMatrix = (A: Matrix, B: Matrix) => {
  const transposedA = transpose(A);

  const normalizedA = multiply(transposedA, A);
  const normalizedB = multiply(transposedA, B);

  return {normalizedA, normalizedB};
}
