import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PenSquare } from 'lucide-react'
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

export default function TaskList({ onRefetch }) {

  const navigate = useNavigate();
  const { user } = useUserContext();

  const [taskList, setTaskList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [selectedTask, setSelctedTask] = useState(null);
  const [deleteSelectedTask, setDeleteSelectedTask] = useState(false);

  const getTaskList = async () => {
    setListLoading(true);

    try{
      const response = await API.get(`${API_PATH}/tasks`);
      //console.log(response.data);
      setTaskList(response.data.data);
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
    if(isUserSetInUserContext(user)) getTaskList();
  }, [user])

  useEffect(()=> {
    if(isUserSetInUserContext(user)) getTaskList();
  }, [onRefetch, user])

  useEffect(() => {
      if (selectedTask != null) {
        navigate(`/tasks/${selectedTask}`);
      }
  }, [selectedTask]);

  const deleteTask = async (taskId) => {
    try{
      setTaskList(taskList.filter(item => item.id != taskId));
      await API.delete(`${API_PATH}/tasks/${taskId}`);
   
      getTaskList();
      navigate("/tasks");  
    } catch(error) {
      //console.error('Error fetching designation:', error);
      setErrors({ global: error.message });
    }
  }

  return (
    <div className="container w-[0%] md:w-[30%]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <Button size="icon" onClick ={()=> navigate("/tasks")} className="bg-blue-900">
              <PenSquare className="h-4 w-4" />
              <span className="sr-only">New message</span>
            </Button>
          </div>

          <Card>
            <ScrollArea className="h-[calc(95vh-8rem)]">
              {listLoading ?
                <div className='pt-40'>
                  <PageLoading/>
                </div>
                :
                <div className="flex flex-col">
                  {taskList.length > 0 ?
                    taskList.map((task, index) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer
                        ${selectedTask == task.id ? 'bg-gray-100' : ''}`}
                      >                   
                        <div className="flex-1 min-w-0" onClick={() => setSelctedTask(task.id)}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold truncate pl-2">{task.prompt}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{task.time}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-muted-foreground truncate">{task.lastMessage}</span>
                            {task.unread > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 w-fit">
                                {task.unread}
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
                            <DropdownMenuItem onClick={() => deleteTask(task.id)}>
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