import React, { useState, useEffect } from 'react'
import { PencilLine } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import PageLoading from '@/mycomponents/loading/PageLoading';
import {useUserContext} from '@/context/UserContext';
import { API } from '@/middleware/Api';
const API_PATH = import.meta.env.VITE_API_PATH;

const Profile = () => {
  const navigate = useNavigate(); 
  const {userInfo} = useUserContext();
  const [profile, setProfile] = useState();
  const [errors, setErrors] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchProfile = async (id) => {
    try {
      const response = await API.get(`${API_PATH}/users/${id}`);
      setProfile(response.data.data);
      setErrors([]);
    } catch (error) {
      // console.error("Error fetching profile data:", error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else{
        setErrors({ global: error.message });
      }
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id) { 
      fetchProfile(userInfo.id);
    }
  }, [userInfo]);

  const editProfile = () => {
    navigate(`/profile/edit`, { state: { profile } }); // Navigate to the medicine detail page
  };

  return (
    <div className='bg-gray-100 flex min-h-[100vh]'>
        {pageLoading?
          <PageLoading />
          :
          <>
            <div className='w-[400px] bg-white p-[30px] rounded-lg mx-auto my-auto mt-24'>
              <div className='flex justify-between mb-[20px]'>
                <p className='font-semibold'>Profile</p>
                <PencilLine className='cursor-pointer hover:text-blue-900' onClick={()=> editProfile()}/>
              </div>
              
              <img src={profile?.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className='w-[65%] aspect-[1/1] rounded-[50%] mx-auto mb-[20px] border-2 border-blue-900'/>
              
              <label>Name: </label>
              <p className='text-gray-700 mb-[4%]'>{profile?.name}</p>
              
              <label>Email: </label>
              <p className='text-gray-700 mb-[4%]'>{profile?.email}</p>
                
              <label>Designation: </label>
              <p className='text-gray-700 mb-[4%]'>{profile?.designation}</p>

              <label>Phone No: </label>
              <p className='text-gray-700 mb-[4%]'>{profile?.phone || ""}</p>

              <p className="validation-error text-center">{errors.global}</p>        
            </div>
          </>
        }
    </div>
  )
}

export default Profile