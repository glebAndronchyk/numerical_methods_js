import {Coefficient, IterationState, MatrixState} from "./types";

export const INITIAL_MATRIX = [[4,1,2, 3],[5,2.2,1.5, 11],[12,3.8,14, 5]];

export const {A, B} = INITIAL_MATRIX.reduce<MatrixState>((acc, row) => {
  const last = row.length - 1

  const aData = row.slice(0, last);
  const bData = [row[last]];

  return {
    A: [...acc.A, aData],
    B: [...acc.B, bData],
  }
}, {A: [], B:[]});

export const getIterationState = () => ({
      prevAbsoluteDifferences: Array.from<Coefficient>({length: A.length}).fill(null),
      totalDiscrepancy: 0,
    }
);

export const MAX_DISCREPANCY = 2;
export const epsilon = 0.01;
