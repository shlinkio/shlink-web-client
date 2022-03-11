import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const SIDEBAR_PRESENT = 'shlink/common/SIDEBAR_PRESENT';
export const SIDEBAR_NOT_PRESENT = 'shlink/common/SIDEBAR_NOT_PRESENT';
/* eslint-enable padding-line-between-statements */

export interface Sidebar {
  sidebarPresent: boolean;
}

type SidebarRenderedAction = Action<string>;
type SidebarNotRenderedAction = Action<string>;

const initialState: Sidebar = {
  sidebarPresent: false,
};

export default buildReducer<Sidebar, SidebarRenderedAction & SidebarNotRenderedAction>({
  [SIDEBAR_PRESENT]: () => ({ sidebarPresent: true }),
  [SIDEBAR_NOT_PRESENT]: () => ({ sidebarPresent: false }),
}, initialState);

export const sidebarPresent = buildActionCreator(SIDEBAR_PRESENT);

export const sidebarNotPresent = buildActionCreator(SIDEBAR_NOT_PRESENT);
