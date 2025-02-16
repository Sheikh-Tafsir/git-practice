import React, { useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Send, Loader2, BookImage, Mic, Volume2 } from 'lucide-react'

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { API } from '@/middleware/Api';
import PageLoading from '@/mycomponents/loading/PageLoading';
import { getPriorityColor, priorityList } from '@/utils/cssUtils';
import { validateFile } from '@/utils/utils';

const API_PATH = import.meta.env.VITE_API_PATH;

// const todoData = {
//   tasks: [
//     {
//       id: 1,
//       title: "Complete project proposal",
//       completed: false,
//       priority: "high",
//       dueDate: "2024-01-15"
//     },
//     {
//       id: 2,
//       title: "Review code changes",
//       completed: true,
//       priority: "medium",
//       dueDate: "2024-01-12"
//     },
//     {
//       id: 3,
//       title: "Update documentation",
//       completed: false,
//       priority: "low",
//       dueDate: "2024-01-20"
//     },
//     {
//       id: 4,
//       title: "Schedule team meeting",
//       completed: false,
//       priority: "high",
//       dueDate: "2024-01-10"
//     },
//     {
//       id: 5,
//       title: "Prepare presentation slides",
//       completed: false,
//       priority: "medium",
//       dueDate: "2024-01-18"
//     }
//   ]
// }

export default function TaskToDo({ onMessageSent }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [listening, setListening] = useState(false);

  const getTaskToDo = async () => { 
    if (!id) return;
    setPageLoading(true);
        
    try{
      const response = await API.get(`${API_PATH}/tasks/${id}`);
      setTasks(response.data.data);
      //console.log(response.data.data);
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
    getTaskToDo();
  }, [id]);

  const toggleSubTask = (taskId) => {
    setTasks(tasks.map(task => 
      taskId == task.id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (listening) handleStopListening();

    if (!prompt.trim()) return;
    setButtonLoading(true);
    
    try{
      const api_path = `${API_PATH}/tasks`;

      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("userId", 1)
      if (image) formData.append("image", image);

      const response = await API.post(api_path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //console.log(response.data);

      setPrompt("");
      setImage(null);      
      setErrors([]);

      if (onMessageSent) onMessageSent();
      if (response.data.data.taskId) navigate(`/tasks/${response.data.data.taskId}`);
    } catch(error) {
        //console.error('Error fetching designation:', error);
      if (error.response?.data) {
          setErrors(error.response.data);
      } else{
          setErrors({ global: error.message });
      }
    } finally {
      setPrompt("");
      setImage(null);
      setButtonLoading(false);
    }
  }

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

  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setPrompt(transcript);
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
  const speak = (task) => {
    const utterance = new SpeechSynthesisUtterance(task.step);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="container w-full md:w-[70%] pb-4">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="bg-black">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Chat Avatar" />
          <AvatarFallback>TL</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Todo List</h1>
        </div>
      </div>

      <Card >
        <CardHeader>
          <CardTitle className="text-2xl font-bold"></CardTitle>
        </CardHeader>
        <CardContent>
          {pageLoading? 
            <PageLoading/>
            :       
            id? (
              <div className="space-y-4">
                {tasks.length > 0 ?
                  tasks.map((task,index) => (
                    <div
                      key={task.id}
                      // onClick={()=> setSelectedTask(task)}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        task.completed ? 'bg-muted' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleSubTask(task.id)}
                          aria-label={`Mark "${task.step}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        />
                        <div className="space-y-1">
                          <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {(index+1) + ". " + task.step}
                          </p>
                          {/* <p className="text-sm text-muted-foreground">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p> */}
                        </div>
                      </div>

                      <Badge className={`${getPriorityColor(priorityList[0])} text-white capitalize mr-2`}>
                        {priorityList[0]}
                      </Badge>

                      <Button type="button" size="icon" onClick={() =>speak(task)} variant="outline">
                        <Volume2 className="h-5 w-5" />
                        <span className="sr-only">Speech To Text</span>
                      </Button>
                    </div>
                  ))
                  :
                  <p>Nothing to show</p>
                }
              </div>
              ) : (
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

                  <Input
                    placeholder="Type a message..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
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
              )
          }
        </CardContent>
      </Card>
    </div>
  )
}

