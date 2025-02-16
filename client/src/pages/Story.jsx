import React, { useState, useEffect} from 'react';

import { API } from '@/middleware/Api';

const API_PATH = import.meta.env.VITE_API_PATH;

const Story = () => {

    const [image, setImage] = useState([]);

    const getImage = async () => {
        try{
            const response = await API.post(`${API_PATH}/story`, {prompt: "naruto rasengan"});
            //console.log(response.data.data);
            setImage(response.data.data);
          } catch(error) {
              console.error('Error fetching designation:', error);
          }
    }

    useEffect(()=> {
        getImage();
    }, [])

  return (
    <div className='pt-20'>
    <p>asfasf</p>
      {image && <img src={"data:image/jpeg;base64," + image} />}
    </div>
  )
}

export default Story
