import './task-menu.css';
import * as React from 'react';
type props = {
  children?: React.ReactNode;
};
export const Menu: React.FC<props> = ({ children }) => {
    const [visibility, setVisibility] = React.useState<boolean>(false)
  return (
    <>
      <div className='menu-container'>
        <span className="menu-ellipsis" onClick={() => setVisibility((prev) => !prev) }>...</span>
        {visibility && <div className="menu-popover-container">{children}</div>}
      </div>
    </>
  );
};
