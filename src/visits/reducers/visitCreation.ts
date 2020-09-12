import { Action } from 'redux';
import { CreateVisit } from '../types';

export const CREATE_VISITS = 'shlink/visitCreation/CREATE_VISITS';

export interface CreateVisitsAction extends Action<typeof CREATE_VISITS> {
  createdVisits: CreateVisit[];
}

export const createNewVisits = (createdVisits: CreateVisit[]): CreateVisitsAction => ({
  type: CREATE_VISITS,
  createdVisits,
});
