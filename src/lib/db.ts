import Message from "@/models/message";
import ChatRoom from "@/models/room";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "chatty-chit-chat.firebaseapp.com",
  projectId: "chatty-chit-chat",
  storageBucket: "chatty-chit-chat.appspot.com",
  messagingSenderId: "206171994425",
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getRoomById(id: string): Promise<ChatRoom | null> {
  const docSnapshot = await getDoc(doc(db, "rooms", id));
  return !docSnapshot.exists() ? null : (docSnapshot.data() as ChatRoom);
}

export async function addRoom(room: ChatRoom) {
  return await setDoc(doc(db, "rooms", room.id), room);
}

export function createRoom(name: string): ChatRoom {
  return { id: Date.now().toString(), name };
}

export async function getAllRoomIds(): Promise<string[]> {
  const roomIds: string[] = [];

  const snapshot = await getDocs(collection(db, "rooms"));
  snapshot.forEach((doc) => {
    roomIds.push(doc.id);
  });

  return roomIds;
}

export async function uploadMessage(roomId: string, message: Message) {
  return await setDoc(
    doc(db, "rooms", roomId, "messages", message.id),
    message
  );
}

export function chatStream(
  roomId: string,
  onUpdate: (data: Message[]) => void
): Unsubscribe {
  return onSnapshot(collection(db, "rooms", roomId, "messages"), (doc) => {
    const messages = doc.docs.map((doc) => doc.data() as Message);
    onUpdate(messages);
  });
}
