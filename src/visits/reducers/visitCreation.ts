import { PayloadAction } from '@reduxjs/toolkit';
import { CreateVisit } from '../types';

export const CREATE_VISITS = 'shlink/visitCreation/CREATE_VISITS';

export type CreateVisitsAction = PayloadAction<{
  createdVisits: CreateVisit[];
}>;

export const createNewVisits = (createdVisits: CreateVisit[]): CreateVisitsAction => ({
  type: CREATE_VISITS,
  payload: { createdVisits },
});
