import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { CreateVisit } from '../types';

const CREATE_VISITS = 'shlink/visitCreation/CREATE_VISITS';

export type CreateVisitsAction = PayloadAction<{
  createdVisits: CreateVisit[];
}>;

export const createNewVisits = createAction(
  CREATE_VISITS,
  (createdVisits: CreateVisit[]) => ({ payload: { createdVisits } }),
);
