import React, { useState, useEffect, useContext } from 'react';
import Markdown from 'react-native-markdown-display';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Switch, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';
import { getAuth } from 'firebase/auth';

import { DataContext } from '../context/dataContext/DataContext';

export default function ChatScreen() {
  const [fontsLoaded] = useFonts({
    OCRA: require('../assets/fonts/OCRA.ttf'),
  });

  const { 
    createChat, 
    addMessageToChat, 
    fetchChats, 
    loadChat, 
    updateChatTitle, 
    deleteAllChats 
  } = useContext(DataContext);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatsList, setChatsList] = useState<any[]>([]);

  // Actualizar la lista de chats del usuario
  useEffect(() => {
    if (userId) {
      fetchChats(userId).then(chats => setChatsList(chats));
    }
  }, [currentChatId, userId]);

  if (!fontsLoaded) {
    return null;
  }

  const backgroundColor = isDarkMode ? '#3A3D4A' : '#F3F3F3';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryBackground = isDarkMode ? '#2C2C2C' : '#FFFFFF';
  const inputContainerColor = isDarkMode ? '#606060' : '#E0E0E0';
  const botBubbleColor = isDarkMode ? '#606060' : '#E0E0E0';
  const botBubbleTextColor = isDarkMode ? '#FFFFFF' : '#000000';

  const getResponse = async (userInput: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAeDe-evMD8uLSPlXmzpheHJpZeu5BK-AU",
        {
          method: "POST",
          body: JSON.stringify({
            contents: [{
              parts: [{ text: userInput }]
            }]
          })
        }
      );
      const data: APIResponse = await response.json();
      const botResponseText = data?.candidates[0]?.content?.parts[0]?.text;
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          text: botResponseText,
          sent_by: "Bot",
          date: new Date(),
          state: "Delivered"
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Error: ", { error });
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          text: "Error fetching response",
          sent_by: "Bot",
          date: new Date(),
          state: "Delivered"
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Crear un nuevo chat en Firestore asignándole el UID del usuario
  const handleNewChat = async () => {
    if (!userId) return;
    setMenuOpen(false);
    const newChatId = await createChat(userId, "Nuevo Chat");
    if (newChatId) {
      setCurrentChatId(newChatId);
      setMessages([]);
      console.log('Nuevo chat creado con ID:', newChatId);
      fetchChats(userId).then(chats => setChatsList(chats));
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
  
    const userMsg: Message = {
      text: inputText,
      sent_by: "User",
      date: new Date(),
      state: "Sent"
    };

    if (currentChatId && messages.length === 0) {
      await updateChatTitle(currentChatId, userMsg.text);
    }
    
    // Agregar el mensaje del usuario a la UI y a Firestore
    setMessages(prev => [...prev, userMsg]);
    if (currentChatId) {
      await addMessageToChat(currentChatId, userMsg);
    }
  
    const placeholderMsg: Message = {
      text: "Reasoning...",
      sent_by: "Bot",
      date: new Date(),
      state: "Sent"
    };
    setMessages(prev => [...prev, placeholderMsg]);
    
    setInputText("");
  
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAeDe-evMD8uLSPlXmzpheHJpZeu5BK-AU",
        {
          method: "POST",
          body: JSON.stringify({
            contents: [{
              parts: [{ text: userMsg.text }]
            }]
          })
        }
      );
      const data: APIResponse = await response.json();
      const botResponseText = data?.candidates[0]?.content?.parts[0]?.text || "Error fetching response";
  
      const botMsg: Message = {
        text: botResponseText,
        sent_by: "Bot",
        date: new Date(),
        state: "Delivered"
      };
  
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = botMsg;
        return newMessages;
      });
  
      // Guardar en Firestore la respuesta real del bot
      if (currentChatId) {
        await addMessageToChat(currentChatId, botMsg);
      }
    } catch (error) {
      console.error("Error: ", { error });
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: "Error fetching response",
          sent_by: "Bot",
          date: new Date(),
          state: "Delivered"
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Al seleccionar un chat de la lista, se carga la conversación almacenada en Firestore
  const handleSelectChat = async (chatId: string) => {
    if (!userId) return;
    const chatData = await loadChat(chatId);
    if (chatData) {
      setCurrentChatId(chatId);
      setMessages(chatData.messages || []);
    }
    setMenuOpen(false);
  };

  // Borrar todos los chats del usuario actual y actualizar la lista
  const handleClearChats = async () => {
    if (!userId) return;
    await deleteAllChats(userId);
    fetchChats(userId).then(chats => setChatsList(chats));
  };

  const renderMenu = () => (
    <View style={[styles.menuContainer, { backgroundColor: secondaryBackground }]}>
      <TouchableOpacity onPress={handleToggleMenu}>
        <Text style={[styles.menuIcon2, { color: textColor }]}>☰</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.newChatContainer} onPress={handleNewChat}>
        <Text style={[styles.menuItemText, { color: textColor }]}>New Chat</Text>
        <Text style={[styles.menuItemText, { color: textColor }]}>❯</Text>
      </TouchableOpacity>
      <ScrollView style={styles.chatsList}>
        {chatsList.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => handleSelectChat(chat.id)}
          >
            <Text style={[styles.chatItemText, { color: textColor }]}>{chat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.menuItem} onPress={handleClearChats}>
        <Text style={[styles.menuItemText, { color: textColor }]}>Clear conversations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={[styles.menuItemText, { color: textColor }]}>Upgrade to Plus</Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={[styles.menuItemText, { color: textColor }]}>Light mode</Text>
        <Switch
          value={!isDarkMode}
          onValueChange={handleToggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={!isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={[styles.menuItemText, { color: textColor }]}>Updates & FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Link href='../loginScreen' style={styles.menuItem}>
          <Text style={[styles.menuItemText, { color: '#FF4B4B' }]}>Logout</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );

  const renderChatScreen = () => (
    <View style={[styles.chatContainer, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleToggleMenu}>
          <Text style={[styles.menuIcon, { color: textColor }]}>☰</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/ChatGPT_logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.chatContent}>
        {messages.length === 0 ? (
          <Text style={[styles.backgroundText, { color: textColor }]}>
            Ask anything, get your answer
          </Text>
        ) : (
          <ScrollView style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sent_by === "User"
                    ? styles.userBubble
                    : { ...styles.botBubble, backgroundColor: botBubbleColor },
                ]}
              >
                {msg.sent_by === "Bot" ? (
                  <Markdown style={{ body: { color: botBubbleTextColor, fontFamily: 'OCRA' } }}>
                    {msg.text}
                  </Markdown>
                ) : (
                  <Text
                    style={[
                      styles.bubbleText,
                      { color: msg.sent_by === "User" ? "#FFF" : botBubbleTextColor },
                    ]}
                  >
                    {msg.text}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={[styles.inputContainer, { backgroundColor: inputContainerColor }]}>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          placeholder="Type here..."
          placeholderTextColor={isDarkMode ? '#CCC' : '#888'}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>⮚</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderChatScreen()}
      {menuOpen && (
        <View style={styles.sideMenuOverlay}>
          {renderMenu()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  sideMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    zIndex: 999,
    elevation: 5,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    opacity: 0.98,
  },
  chatsList: {
    maxHeight: 200,
    marginVertical: 10,
  },
  chatItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#666',
  },
  chatItemText: {
    fontSize: 16,
    fontFamily: 'OCRA',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  separator: {
    borderBottomWidth: 0.5,
    borderColor: '#666',
    marginBottom: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'OCRA',
    marginRight: 10,
  },
  newBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  menuIcon: {
    fontSize: 20,
    paddingLeft: 5,
    marginTop: 6,
  },
  menuIcon2: {
    fontSize: 20,
    marginBottom: 10,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    paddingRight: 5,
    marginTop: 6,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  backgroundText: {
    fontSize: 16,
    fontFamily: 'OCRA',
  },
  messagesContainer: {
    width: '100%',
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  userBubble: {
    backgroundColor: '#0FA958',
    alignSelf: 'flex-end',
    marginRight: '2%',
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bubbleText: {
    fontFamily: 'OCRA',
  },
  botBubble: {
    alignSelf: 'flex-start',
    marginLeft: '2%',
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  inputContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'OCRA',
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#0FA958',
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});