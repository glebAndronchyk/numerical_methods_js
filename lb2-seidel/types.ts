export type Matrix = number[][];
export type Coefficient = number | null;
export type Equation = (...args: number[]) => number;

export interface MatrixState {
  A: Matrix;
  B: Matrix;
  INITIAL_COEFS: number[];
}

export interface IterationState {
  prevAbsoluteDifferences: number[];
  totalDiscrepancy: number;
}
