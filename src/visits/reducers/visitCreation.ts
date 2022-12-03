import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { CreateVisit } from '../types';

export type CreateVisitsAction = PayloadAction<{
  createdVisits: CreateVisit[];
}>;

export const createNewVisits = createAction(
  'shlink/visitCreation/createNewVisits',
  (createdVisits: CreateVisit[]) => ({ payload: { createdVisits } }),
);
