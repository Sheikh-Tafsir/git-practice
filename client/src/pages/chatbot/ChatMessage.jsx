import React, { useState, useEffect,  useRef  } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ArrowLeft, Send, Loader2, BookImage, Mic, Volume2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import PageLoading from '@/mycomponents/loading/PageLoading';
import { API } from '@/middleware/Api';
import { MAX_FILE_SIZE, validateFile } from '@/utils/utils';

const API_PATH = import.meta.env.VITE_API_PATH;

export default function ChatMessage({ onMessageSent }) {

  const { id } = useParams()
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [listening, setListening] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(listening) handleStopListening();

    if (!newMessage.trim()) return;

    addMessageInChat(newMessage, "user");
    setButtonLoading(true);

    try{
      const api_path = id ? `${API_PATH}/chatbot/${id}` : `${API_PATH}/chatbot/0`;

      const formData = new FormData();
      formData.append("chatHistory", JSON.stringify(chatHistory));
      formData.append("newMessage", newMessage);
      formData.append("userId", 1)
      if (image) formData.append("image", image);

      const response = await API.post(api_path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //console.log(response.data);

      setNewMessage("");
      setImage(null);
      setErrors([]);
      
      setReply(response.data.data.reply);    
      addMessageInChat(response.data.data.reply, "model");

      if (onMessageSent) onMessageSent();
      if (!id && response.data.data.chatBotId) navigate(`/chatbot/${response.data.data.chatBotId}`);
    } catch(error) {
        //console.error('Error fetching designation:', error);
      if (error.response?.data) {
          setErrors(error.response.data);
      } else{
          setErrors({ global: error.message });
      }
    } finally {
      setNewMessage("");
      setImage(null);
      setButtonLoading(false);
    }
  }

  //add message and reply in chat
  const addMessageInChat = (message, role) => {
    setChatHistory((prevMessages) => [
      ...(prevMessages),
      { message, role },
    ]);
  }
      
  const getChatMessages = async () => {
    if (!id) {
      setChatHistory([]); 
      return;
    }
    
    setPageLoading(true);
        
    try{
      const response = await API.get(`${API_PATH}/chatbot/${id}`);
      setChatHistory(response.data.data);
      setErrors([]);
    } catch(error) {
            //console.error('Error fetching designation:', error);
        if (error.response?.data) {
          setErrors(error.response.data);
        } else{
          setErrors({ global: error.message });
        }
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(()=> {
    getChatMessages();
  }, [id]);

  const handleImageChange = ({ target: { files } }) => {
    const file = files[0];
    if (validateFile(file)) {
      setImage(file);
    } else {
      setErrors({ global: "File too large, Select image smaller than 5MB." });
    }
  };

  //open image input when click import button
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Speech to text
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setNewMessage(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStartListening = () => {
    setListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  // Text to speech
  const speak = () => {
    if (!chatHistory || chatHistory.length === 0) return;
  
    const lastModelMessage = chatHistory.slice().reverse().find(msg => msg.role === "model").message;
    console.log(lastModelMessage);
  
    const MAX_CHUNK_LENGTH = 150; // Adjust as needed (characters)
  
    const sentences = lastModelMessage.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  
    const chunks = [];
    let currentChunk = "";
  
    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length <= MAX_CHUNK_LENGTH) {
        currentChunk += sentence; // Add to the current chunk
      } else {
        if (currentChunk) chunks.push(currentChunk.trim()); // Store previous chunk
        currentChunk = sentence; // Start new chunk
      }
    });
  
    if (currentChunk) chunks.push(currentChunk.trim()); 
  
    let currentUtterance = null;
  
    const speakNextChunk = () => {
      if (currentUtterance) {
        speechSynthesis.cancel();
      }
  
      if (chunks.length > 0) {
        const chunk = chunks.shift();
        currentUtterance = new SpeechSynthesisUtterance(chunk);
        speechSynthesis.speak(currentUtterance);
        currentUtterance.onend = speakNextChunk; // Chain to the next chunk
        currentUtterance.onerror = (event) => {
          console.error("Speech chunk error:", event);
        };
      } else {
        currentUtterance = null; // All chunks spoken
      }
    };
  
    speakNextChunk();
  };
  

  return (
    <div className="container h-[90vh] flex flex-col w-full md:w-[70%] bg-gray-100 pt-6 pb-4">
      <div className="flex items-center gap-4 mb-2">
        <Avatar className="bg-black">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Chat Avatar" />
          <AvatarFallback>CB</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Chatbot {id}</h1>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      
      <Card className="flex-1 mb-4">
        <ScrollArea className="h-[65vh] p-4 scroll-container-class">
          <div className="flex flex-col gap-4">
            {pageLoading? 
              <div className='pt-40'>
                <PageLoading/>
              </div>
              :     
              chatHistory.length > 0 ?
                (chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                )))
                :
                <div className='w-full h-full flex'>
                  <div className='mx-auto mt-[200px] text-center'>                  
                    <p className='text-2xl font-semibold mb-2'>New chat</p>
                    <p>Have anything in mind?</p>
                  </div>
                </div>
            }
          </div>
        </ScrollArea>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef}/>
        {image ?
          <div className='w-10 h-10 rounded overflow-hidden shadow-lg' onClick={handleButtonClick}>
            <img src={URL.createObjectURL(image)} className='w-full h-full'/>
          </div>
          :
          <Button type="button" size="icon" onClick={handleButtonClick} className="bg-blue-900">
              <BookImage className="h-5 w-5" />
            <span className="sr-only">Image url</span>
          </Button>
        }

        <Button type="button" size="icon" variant={listening ? "outline": ""} onClick={!listening ? handleStartListening : handleStopListening} 
          disabled={!listening ? isListening : !isListening} className="bg-blue-600">
              <Mic className="h-5 w-5" />
              <span className="sr-only">Text to speech</span>
        </Button>
        <Button type="button" size="icon" onClick={speak} variant="outline">
              <Volume2 className="h-5 w-5" />
              <span className="sr-only">Speech To Text</span>
        </Button>
        
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        {!buttonLoading ?
          <Button type="submit" size="icon" className="bg-blue-900">
              <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
          :
          <Button type="submit" size="icon" disabled>
            <Loader2 className="animate-spin" />
          </Button>
        }
      </form>
    </div>
  )
}

