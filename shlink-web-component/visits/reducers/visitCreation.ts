import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import type { CreateVisit } from '../types';

export type CreateVisitsAction = PayloadAction<{
  createdVisits: CreateVisit[];
}>;

export const createNewVisits = createAction(
  'shlink/visitCreation/createNewVisits',
  (createdVisits: CreateVisit[]) => ({ payload: { createdVisits } }),
);
