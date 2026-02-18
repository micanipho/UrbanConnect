import React, { useReducer } from 'react';
import { ConversationContext } from './context';
import { conversationReducer } from './reducer';

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(conversationReducer, {});

  return (
    <ConversationContext.Provider value={{ state, dispatch }}>
      {children}
    </ConversationContext.Provider>
  );
};
