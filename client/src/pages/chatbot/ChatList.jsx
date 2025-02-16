import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PenSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import PageLoading from '@/mycomponents/loading/PageLoading';
import { API } from '@/middleware/Api';
import { useUserContext } from '@/context/UserContext';
import { isUserSetInUserContext } from '@/utils/utils';

const API_PATH = import.meta.env.VITE_API_PATH;

export default function ChatList({ onRefetch }) {

  const navigate = useNavigate();
    const { user } = useUserContext();

  const [listLoading, setListLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [errors, setErrors] = useState([]);

  const getChatList = async () => {
    setListLoading(true);

    try{
      const response = await API.get(`${API_PATH}/chatbot`);
      //console.log(response.data.data);
      setChatList(response.data.data);
      setErrors([]);
    } catch(error) {
        //console.error('Error fetching designation:', error);
        if (error.response?.data) {
            setErrors(error.response.data);
        } else{
            setErrors({ global: error.message });
        }
    } finally {
      setListLoading(false);
    }
  }

  useEffect(()=> {
    if(isUserSetInUserContext(user)) getChatList();
  }, [user])

  useEffect(()=> {
    if(isUserSetInUserContext(user)) getChatList();
  }, [onRefetch, user])


  useEffect(() => {
    if (selectedChat !== null) {
      navigate(`/chatbot/${selectedChat}`);
    }
  }, [selectedChat]);

  const deleteChat = async (chatBotId) => {
    try{
      setChatList(chatList.filter(item => item.id != chatBotId));
      await API.delete(`${API_PATH}/chatbot/${chatBotId}`);
      
      getChatList();
      navigate("/chatbot");
    } catch(error) {
      //console.error('Error fetching designation:', error);
      setErrors({ global: error.message });
    }
  }

  return (
    <div className="container w-[0%] md:w-[30%] bg-gray-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button size="icon" onClick ={()=> navigate("/chatbot")} className="bg-blue-900">
          <PenSquare className="h-4 w-4" />
          <span className="sr-only">New message</span>
        </Button>
      </div>
      <Card>
        <ScrollArea className="h-[calc(95vh-8rem)]">
          {listLoading ?
            <PageLoading/>
            :
            <div className="flex flex-col">
              {chatList.length > 0 ?
                chatList.map((chat, index) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer 
                    ${selectedChat == chat.id ? 'bg-gray-100' : ''}`}
                  >
                    <Avatar>
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{chat.name} {chat.id}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground truncate">{chat.lastMessage}</span>
                        {chat.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 w-fit">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical className='text-gray-600 hover:text-black'/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-30 ml-40">
                        <DropdownMenuItem>
                          <Pencil className='h-6 w-6 pr-2'/>
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteChat(chat.id)}>
                          <Trash2 className='h-6 w-6 pr-2'/>
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
                :
                <div className='flex'>
                  <p className='mx-auto pt-2 font-semibold'>No chat started</p>
                </div>
              }
            </div>
          }
        </ScrollArea>
      </Card>
    </div>
  )
}