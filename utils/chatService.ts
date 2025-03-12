import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, getDoc, arrayUnion, query, where } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Message } from '@/interfaces/AppInterfaces';

export async function createChat(userId: string, title: string) {
  try {
    const chatData = {
      userId,
      title,
      createdAt: new Date(),
      messages: [] as Message[],
    };
    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  } catch (error) {
    console.error("Error creando chat: ", error);
    return null;
  }
}

export async function addMessageToChat(chatId: string, message: Message) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion(message)
    });
  } catch (error) {
    console.error("Error agregando mensaje: ", error);
  }
}

export async function fetchChats(userId: string) {
  try {
    const chatsCol = collection(db, 'chats');
    const q = query(chatsCol, where('userId', '==', userId));
    const chatsSnapshot = await getDocs(q);
    const chatsList = chatsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return chatsList;
  } catch (error) {
    console.error("Error obteniendo chats: ", error);
    return [];
  }
}

export async function loadChat(chatId: string) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      return chatSnap.data();
    } else {
      console.error("No se encontró el chat");
      return null;
    }
  } catch (error) {
    console.error("Error cargando chat: ", error);
    return null;
  }
}

export async function updateChatTitle(chatId: string, title: string) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, { title });
  } catch (error) {
    console.error("Error actualizando el título del chat: ", error);
  }
}

export async function deleteAllChats(userId: string) {
  try {
    const chatsCol = collection(db, 'chats');
    const q = query(chatsCol, where('userId', '==', userId));
    const chatsSnapshot = await getDocs(q);
    const deletePromises = chatsSnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, 'chats', docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log("Todos los chats eliminados");
  } catch (error) {
    console.error("Error eliminando chats: ", error);
  }
}