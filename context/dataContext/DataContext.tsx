// DataContext.tsx
import React, { createContext, ReactNode } from 'react';
import {
  createChat as createChatService,
  addMessageToChat as addMessageToChatService,
  fetchChats as fetchChatsService,
  loadChat as loadChatService,
  updateChatTitle as updateChatTitleService,
  deleteAllChats as deleteAllChatsService,
} from '../../utils/chatService';
import { Message } from '@/interfaces/AppInterfaces';

type DataContextType = {
  createChat: (userId: string, title: string) => Promise<string | null>;
  addMessageToChat: (chatId: string, message: Message) => Promise<void>;
  fetchChats: (userId: string) => Promise<any[]>;
  loadChat: (chatId: string) => Promise<any | null>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteAllChats: (userId: string) => Promise<void>;
};

export const DataContext = createContext<DataContextType>({
  createChat: async () => null,
  addMessageToChat: async () => {},
  fetchChats: async () => [],
  loadChat: async () => null,
  updateChatTitle: async () => {},
  deleteAllChats: async () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  
  const createChat = async (userId: string, title: string) => {
    return await createChatService(userId, title);
  };

  const addMessageToChat = async (chatId: string, message: Message) => {
    await addMessageToChatService(chatId, message);
  };

  const fetchChats = async (userId: string) => {
    return await fetchChatsService(userId);
  };

  const loadChat = async (chatId: string) => {
    return await loadChatService(chatId);
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    await updateChatTitleService(chatId, title);
  };

  const deleteAllChats = async (userId: string) => {
    await deleteAllChatsService(userId);
  };

  return (
    <DataContext.Provider
      value={{
        createChat,
        addMessageToChat,
        fetchChats,
        loadChat,
        updateChatTitle,
        deleteAllChats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};