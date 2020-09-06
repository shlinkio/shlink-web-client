import { Action } from 'redux';

type ActionHandler<State, AT> = (currentState: State, action: AT) => State;
type ActionHandlerMap<State, AT> = Record<string, ActionHandler<State, AT>>;

export const buildReducer = <State, AT extends Action>(map: ActionHandlerMap<State, AT>, initialState: State) => (
  state: State | undefined,
  action: AT,
): State => {
  const { type } = action;
  const actionHandler = map[type];
  const currentState = state ?? initialState;

  return actionHandler ? actionHandler(currentState, action) : currentState;
};

export const buildActionCreator = <T extends string>(type: T) => (): Action<T> => ({ type });
