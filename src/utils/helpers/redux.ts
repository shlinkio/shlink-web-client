import { createAsyncThunk as baseCreateAsyncThunk, AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { ShlinkState } from '../../container/types';

type ActionHandler<State, AT> = (currentState: State, action: AT) => State;
type ActionHandlerMap<State, AT> = Record<string, ActionHandler<State, AT>>;

/** @deprecated */
export const buildReducer = <State, AT extends Action>(map: ActionHandlerMap<State, AT>, initialState: State) => (
  state: State | undefined,
  action: AT,
): State => {
  const { type } = action;
  const actionHandler = map[type];
  const currentState = state ?? initialState;

  return actionHandler ? actionHandler(currentState, action) : currentState;
};

/** @deprecated */
export const buildActionCreator = <T extends string>(type: T) => (): Action<T> => ({ type });

export const createAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: ShlinkState }>,
) => baseCreateAsyncThunk(typePrefix, payloadCreator);
