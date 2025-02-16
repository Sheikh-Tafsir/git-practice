import React, { useState, useEffect } from 'react'
import { PencilLine } from 'lucide-react'
import { useNavigate, useParams } from "react-router-dom";

import { useNavigationUtils } from '@/middleware/NavigationUtils';
import PageLoading from '@/mycomponents/loading/PageLoading';
import { API } from '@/middleware/Api';

const API_PATH = import.meta.env.VITE_API_PATH;

const ShowUser = () => {

  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { navigateError } = useNavigationUtils();

  const [profile, setProfile] = useState();
  const [errors, setErrors] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await API.get(`${API_PATH}/users/${id}`);
      setProfile(response.data.data);
      setErrors([]);
    } catch (error) {
      // console.error("Error fetching profile data:", error);
      navigateError(error);
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
    if (id) { 
      fetchProfile();
    }
  }, [id]);

  const editProfile = () => {
    navigate(`/admin/users/${id}/edit`, { state: { profile } }); // Navigate to the medicine detail page
  };

  return (
    <div className='bg-gray-200 flex min-h-[100vh]'>
        {pageLoading?
          <PageLoading />
          :
          <>
            <div className='w-[350px] bg-white p-[30px] rounded-lg mx-auto my-auto'>
              <div className='flex justify-between mb-[20px]'>
                <p className='font-semibold'>Profile</p>
                <PencilLine className='cursor-pointer hover:text-blue-900' onClick={()=> editProfile()}/>
              </div>
              
              <img src={profile?.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className='w-[65%] aspect-[1/1] rounded-[50%] mx-auto mb-[20px]'/>
              
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

export default ShowUser