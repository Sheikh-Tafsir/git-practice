import React, {useState} from 'react'
import TaskList from './TaskList'
import TaskToDo from './TaskToDo'

const Tasks = () => {

    const [refetchTrigger, setRefetchTrigger] = useState(false);
  
    const handleRefetch = () => {
      setRefetchTrigger((prev) => !prev);
    };

  return (
    <div className='flex flex-col md:flex-row pt-24 pb-8 bg-gray-100'>
        <TaskList onRefetch={refetchTrigger}/>
        <TaskToDo onMessageSent={handleRefetch}/>
    </div>
  )
}

export default Tasks
