import Head from "next/head";
import styles from "@/styles/home.module.css";
import CustomForm from "@/components/home/form";
import { useState } from "react";
import ChatRoom from "@/models/room";
import { useRouter } from "next/router";
import formStyles from "@/components/home/form.module.css";
import { isValidName } from "@/lib/abc";

enum FormType {
  INITIAL,
  JOIN_ROOM_FORM,
  CREATE_ROOM_FORM,
}

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [formType, setFormType] = useState(FormType.INITIAL);
  const [inputFieldComment, setInputFieldComment] = useState("");
  const [inputFieldClass, setInputFieldClass] = useState("");
  const [inputFieldCommentClass, setInputFieldCommentClass] = useState("");

  function handleRoomIdChange(newRoomId: string) {
    setRoomId(newRoomId);
  }

  function handleRoomNameChange(newRoomName: string) {
    setRoomName(newRoomName);

    if (isValidName(newRoomName)) {
      setInputFieldClass(styles.valid);
    } else {
      setInputFieldClass(styles.invalid);
    }
  }

  function handleJoinRoom() {
    setInputFieldComment("Checking availability...");
    fetch(`/api/room/${roomId}`).then(async (res) => {
      if (res.status == 404) {
        setInputFieldComment("Room does not exist!");
        setInputFieldCommentClass(styles.invalidComment);
        return;
      }
      const resData = await res.json();
      const room = resData.room as ChatRoom;

      setInputFieldComment("Room found! Joining...");
      setInputFieldCommentClass(styles.validComment);
      gotoChat(room);
    });
  }

  function handleCreateRoom() {
    setInputFieldComment("Creating room...");
    fetch(`/api/room/new`, {
      method: "POST",
      body: JSON.stringify({ name: roomName }),
    }).then(async (res) => {
      const resData = await res.json();
      const room = resData.room as ChatRoom;

      setInputFieldComment("Room created! Joining...");
      setInputFieldCommentClass(styles.validComment);
      gotoChat(room);
    });
  }

  function gotoChat(room: ChatRoom) {
    router.push(`/room/${room.id}`);
  }

  return (
    <>
      <Head>
        <title>Chat Room | Index</title>
        <meta name="description" content="Chat in rooms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {formType != FormType.INITIAL && (
          <h1 className={styles.heading1}>
            Welcome To <span className={styles.chatty}>Chatty</span>
          </h1>
        )}

        {formType == FormType.INITIAL && (
          <div className={formStyles.form}>
            <div className={formStyles.formContent}>
              <p className={styles.heading2}>
                Hey there!
                <br />
                Welcome To <span className={styles.chatty}>Chatty</span>
              </p>
            </div>
            <div className={formStyles.formBtns}>
              <button
                onClick={() => setFormType(FormType.JOIN_ROOM_FORM)}
                type="button"
                className={formStyles.formBtn}
              >
                JOIN ROOM
              </button>
              <button
                onClick={() => setFormType(FormType.CREATE_ROOM_FORM)}
                type="button"
                className={formStyles.formBtn}
              >
                CREATE NEW ROOM
              </button>
            </div>
          </div>
        )}

        {formType == FormType.JOIN_ROOM_FORM && (
          <CustomForm
            formLabel="Enter Room ID"
            inputValue={roomId}
            inputPlaceholder="Eg. 12345678"
            inputFieldComment={inputFieldComment}
            inputFieldCommentClass={inputFieldCommentClass}
            onEnterPressed={handleJoinRoom}
            inputChangeHandler={handleRoomIdChange}
            formButtonData={[
              {
                btnValue: "JOIN ROOM",
                btnHandler: handleJoinRoom,
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
            inputFieldComment={inputFieldComment}
            inputFieldCommentClass={inputFieldCommentClass}
            onEnterPressed={handleCreateRoom}
            inputChangeHandler={handleRoomNameChange}
            formButtonData={[
              {
                btnValue: "CREATE ROOM",
                btnHandler: handleCreateRoom,
              },
            ]}
          />
        )}
      </main>
    </>
  );
}
