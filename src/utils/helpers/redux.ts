import { Action } from 'redux';

type ActionDispatcher<State, AT> = (currentState: State, action: AT) => State;
type ActionDispatcherMap<State, AT> = Record<string, ActionDispatcher<State, AT>>;

export const buildReducer = <State, AT extends Action>(map: ActionDispatcherMap<State, AT>, initialState: State) => (
  state: State | undefined,
  action: AT,
): State => {
  const { type } = action;
  const actionDispatcher = map[type];
  const currentState = state ?? initialState;

  return actionDispatcher ? actionDispatcher(currentState, action) : currentState;
};

export const buildActionCreator = <T extends string>(type: T) => (): Action<T> => ({ type });
