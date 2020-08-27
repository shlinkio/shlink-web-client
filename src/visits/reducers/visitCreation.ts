import { Action } from 'redux';
import { CreateVisit } from '../types';

export const CREATE_VISIT = 'shlink/visitCreation/CREATE_VISIT';

type CreateVisitAction = Action<typeof CREATE_VISIT> & CreateVisit;

export const createNewVisit = ({ shortUrl, visit }: CreateVisit): CreateVisitAction => ({
  type: CREATE_VISIT,
  shortUrl,
  visit,
});
