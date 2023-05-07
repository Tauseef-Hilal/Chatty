import Head from "next/head";
import styles from "@/styles/home.module.css";
import CustomForm from "@/components/home/form";
import { useState } from "react";

enum FormType {
  INITIAL,
  JOIN_ROOM_FORM,
  CREATE_ROOM_FORM,
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [formType, setFormType] = useState(FormType.INITIAL);
  const [inputFieldClass, setInputFieldClass] = useState("");

  function handleUsernameChange(newUsername: string) {
    validateName(newUsername);
    setUsername(newUsername);
  }

  function handleRoomIdChange(newRoomId: string) {
    setRoomId(newRoomId);
  }

  function handleRoomNameChange(newRoomName: string) {
    validateName(newRoomName);
    setRoomName(newRoomName);
  }

  function validateName(name: string) {
    if (name.length < 3) {
      setInputFieldClass(styles.invalid);
      return;
    }

    setInputFieldClass(styles.valid);
  }

  return (
    <>
      <Head>
        <title>Chat Room</title>
        <meta name="description" content="Chat in rooms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.heading}>
          Welcome To <span className={styles.chatty}>Chatty</span>
        </h1>

        {formType == FormType.INITIAL && (
          <CustomForm
            formLabel="Enter Username"
            inputValue={username}
            inputPlaceholder="Eg. strange_guy"
            inputFieldClass={inputFieldClass}
            inputChangeHandler={handleUsernameChange}
            formButtonData={[
              {
                btnValue: "JOIN ROOM",
                btnHandler: () => setFormType(FormType.JOIN_ROOM_FORM),
              },
              {
                btnValue: "CREATE NEW ROOM",
                btnHandler: () => setFormType(FormType.CREATE_ROOM_FORM),
              },
            ]}
          />
        )}

        {formType == FormType.JOIN_ROOM_FORM && (
          <CustomForm
            formLabel="Enter Room ID"
            inputValue={roomId}
            inputPlaceholder="Eg. 12345678"
            inputFieldClass={inputFieldClass}
            inputChangeHandler={handleRoomIdChange}
            formButtonData={[
              {
                btnValue: "JOIN ROOM",
                btnHandler: () => "",
              },
            ]}
          />
        )}

        {formType == FormType.CREATE_ROOM_FORM && (
          <CustomForm
            formLabel="Enter Room Name"
            inputValue={roomName}
            inputPlaceholder="Eg. strange_guys"
            inputFieldClass={inputFieldClass}
            inputChangeHandler={handleRoomNameChange}
            formButtonData={[
              {
                btnValue: "CREATE ROOM",
                btnHandler: () => "",
              },
            ]}
          />
        )}
      </main>
    </>
  );
}
