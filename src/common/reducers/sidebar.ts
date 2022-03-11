import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const SIDEBAR_RENDERED = 'shlink/common/SIDEBAR_RENDERED';
export const SIDEBAR_NOT_RENDERED = 'shlink/common/SIDEBAR_NOT_RENDERED';
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
  [SIDEBAR_RENDERED]: () => ({ hasSidebar: true }),
  [SIDEBAR_NOT_RENDERED]: () => ({ hasSidebar: false }),
}, initialState);

export const sidebarRendered = buildActionCreator(SIDEBAR_RENDERED);

export const sidebarNotRendered = buildActionCreator(SIDEBAR_NOT_RENDERED);
