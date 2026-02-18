import React from 'react';
import { Outlet } from 'react-router-dom';

const ChatLayout = () => {
  return (
    <div>
      <h2>Chat Layout</h2>
      <Outlet />
    </div>
  );
};

export default ChatLayout;
