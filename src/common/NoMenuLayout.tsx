import { FC } from 'react';
import './NoMenuLayout.scss';

const NoMenuLayout: FC = ({ children }) => <div className="no-menu-wrapper container-xl">{children}</div>;

export default NoMenuLayout;
