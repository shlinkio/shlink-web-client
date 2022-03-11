import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const SIDEBAR_PRESENT = 'shlink/common/SIDEBAR_PRESENT';
export const SIDEBAR_NOT_PRESENT = 'shlink/common/SIDEBAR_NOT_PRESENT';
/* eslint-enable padding-line-between-statements */

export interface Sidebar {
  hasSidebar: boolean;
}

type SidebarRenderedAction = Action<string>;
type SidebarNotRenderedAction = Action<string>;

const initialState: Sidebar = {
  hasSidebar: false,
};

export default buildReducer<Sidebar, SidebarRenderedAction & SidebarNotRenderedAction>({
  [SIDEBAR_PRESENT]: () => ({ hasSidebar: true }),
  [SIDEBAR_NOT_PRESENT]: () => ({ hasSidebar: false }),
}, initialState);

export const sidebarPresent = buildActionCreator(SIDEBAR_PRESENT);

export const sidebarNotPresent = buildActionCreator(SIDEBAR_NOT_PRESENT);
