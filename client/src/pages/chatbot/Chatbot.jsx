import React, {useState} from "react";
import ChatList from "./ChatList";
import ChatMessage from "./ChatMessage";

const Chatbot = () => {

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  return (
    <div className='flex flex-col md:flex-row pt-16 pb-8'>
      <ChatList onRefetch={refetchTrigger} />
      <ChatMessage onMessageSent={handleRefetch} />
    </div>
  )
}

export default Chatbot
