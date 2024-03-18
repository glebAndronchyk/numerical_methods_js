import {epsilon, MAX_DISCREPANCY, A, B, getIterationState} from "./settings";
import {Equation, Matrix} from "./types";
import {getEquations, getNormalizedMatrix} from "./helpers";

const iterate = (equations: Equation[], coefficients: number[] , state = getIterationState()): number[] | null => {

  let accuracyCount = 0;
  let currentAbsoluteDiff: number[] = [];
  const coefficientsCopy = [...coefficients];

  equations.forEach((eq, index) => {
    const equationCoefs =  [...coefficientsCopy];
    equationCoefs[index] = null; // resets current coef in order to prevent it from taking part in calculations

    // Current X is being calculated
    const result = eq(...equationCoefs);
    // This is used in comparison with epsilon
    const absoluteDifference = Math.abs(coefficientsCopy[index] - result);
    currentAbsoluteDiff.push(absoluteDifference);

    if (absoluteDifference <= epsilon) {
      accuracyCount++;
    }

    coefficientsCopy[index] = result;
  });

  const isDifferencesNormal = () => {
    return currentAbsoluteDiff.every((n, i) => n < state.prevAbsoluteDifferences[i]);
  }

  if (!isDifferencesNormal()) {
    state.totalDiscrepancy++;
  }

  // when matrix diverged => I should normalize it
  if (state.totalDiscrepancy >= MAX_DISCREPANCY) {
    return null;
  }

  // clarification ended
  if (accuracyCount === equations.length) {
    return coefficientsCopy;
  }

  state.prevAbsoluteDifferences = currentAbsoluteDiff;
  return iterate(equations, coefficientsCopy, state);
}

export const seidelClarify = (mA: Matrix, mB: Matrix) => {
  const equations = getEquations(mA, mB);
  const coefficients = Array.from({length: mA[0].length}).fill(1) as number[];

  const firstIteration = iterate(equations, coefficients);

  if (!firstIteration) {
    // matrix diverged
    const {normalizedA, normalizedB} = getNormalizedMatrix(mA, mB);
    const normalizedEquations = getEquations(normalizedA, normalizedB)

    return iterate(normalizedEquations, coefficients);
  }

  return firstIteration;
}

console.log(seidelClarify(A, B).reduce((acc, x, i) => ({
  ...acc,
  [`x${i + 1}`]: x,
}), {}));
