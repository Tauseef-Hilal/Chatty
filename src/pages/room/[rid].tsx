import { GetServerSideProps, GetStaticPaths } from "next";
import Head from "next/head";
import ChatRoom from "@/models/room";
import {
  chatStream,
  getAllRoomIds,
  getRoomById,
  uploadMessage,
} from "@/lib/db";
import { useEffect, useRef, useState } from "react";
import CustomForm from "@/components/home/form";
import { isValidName } from "@/lib/abc";
import homeStyles from "@/styles/home.module.css";
import styles from "@/styles/chat.module.css";
import Message from "@/models/message";

type ChatProps = {
  room: ChatRoom;
};

export default function Chat({ room }: ChatProps) {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [inputFieldClass, setInputFieldClass] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageViewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    messageViewRef.current?.scroll({
      top: messageViewRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const unsub = chatStream(room.id, (newMessages) =>
      setMessages(newMessages)
    );
    return () => unsub();
  }, []);

  function onUsernameChange(newUsername: string) {
    setUsername(newUsername);

    if (isValidName(newUsername)) {
      setInputFieldClass(homeStyles.valid);
    } else {
      setInputFieldClass(homeStyles.invalid);
    }
  }

  function handleUsernameSubmit() {
    if (!isValidName(username)) return;
    setIsUsernameSet(true);
  }

  function sendMessage() {
    if (!message) return;

    uploadMessage(room.id, {
      content: message,
      author: username,
      id: Date.now().toString(),
    });
    setMessage("");
  }

  return (
    <>
      <Head>
        <title>Chat Room</title>
        <meta name="description" content="Chat in room" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header
        onClick={async () => navigator.clipboard.writeText(room.id)}
        className={styles.header}
      >
        <span className={styles.gold}>#</span>
        <span className={styles.green}>{room?.name}</span>
      </header>
      <main className={styles.main}>
        <section ref={messageViewRef} className={styles.messageView}>
          {messages.reverse().map((message) => {
            return (
              <div key={message.id} className={styles.message}>
                <span className={styles.messageAuthor}>{message.author}:</span>
                <span className={styles.messageContent}>{message.content}</span>
              </div>
            );
          })}
        </section>
        <section className={styles.chatInput}>
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
            value={message}
            className={styles.messageField}
            type="text"
            placeholder="Message"
          />
          <button
            className={styles.sendMessageBtn}
            type="button"
            onClick={sendMessage}
          >
            Send
          </button>
        </section>
      </main>

      {!isUsernameSet && (
        <CustomForm
          centerSelf
          formLabel="Enter Username to chat"
          inputValue={username}
          inputPlaceholder="Eg. strange_guy"
          inputFieldClass={inputFieldClass}
          inputChangeHandler={onUsernameChange}
          formButtonData={[
            {
              btnValue: "CHAT NOW",
              btnHandler: handleUsernameSubmit,
            },
          ]}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const room = await getRoomById(params?.rid as string);
  return {
    props: { room },
  };
};
