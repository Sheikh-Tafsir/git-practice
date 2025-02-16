import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from 'react-router-dom';
import PageLoading from "@/mycomponents/loading/PageLoading";
import ButtonLoading from "@/mycomponents/loading/Loading";
import { imageToByte } from "@/utils/utils";
import { API } from "@/middleware/Api";
const API_PATH = import.meta.env.VITE_API_PATH;

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phone: '',
  });
  const [errors, setErrors] = useState([]);

  const [imageFile, setImageFile] = useState("");
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    if (!location.state || !location.state.profile) {
      console.error("No profile found in location state");
      navigate("/profile"); // Redirect if no profile found
    } else {
      const { id, image, ...rest} = location.state.profile;
      //console.log(location.state.profile);
      setFormData(rest);
      setExistingImage(image);
      setPageLoading(false);
    }
  }, [location.state, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Example: Limit file size to 5MB
        alert("File size is too large. Please select a file smaller than 5MB.");
        return;
      }
      setImageFile(file);
    }
  }

  // Axios PUT request to update the profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setButtonLoading(true);
      var image = null;
      if(imageFile){
        image = await imageToByte(imageFile);
      }

      await API.put(`${API_PATH}/users/profile`, {
        id:location.state.profile.id,
        ...formData,
        image,
      });
      navigate(`/profile`);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      else{
        setErrors({ global: error.message });
      }
     
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100vh] pt-24 pb-5 bg-gray-100">
      <Card className="w-[400px] md:w-[450px] bg-white mx-auto my-auto">
        {pageLoading ? (
          <PageLoading />
        ) : (
          <>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update existing profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <p className='validation-error'>{errors.name}</p>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Designation</Label>
                    <Input
                      name="designation"
                      placeholder="Your Designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                    <p className='validation-error'>{errors.designation}</p>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Phone No</Label>
                    <Input
                      name="phone"
                      placeholder="Your Phone No"
                      value={formData.phone || ''}
                      onChange={handleChange}
                    />
                    <p className='validation-error'>{errors.phone}</p>
                  </div>

                   {/* Image Link Field */}
                   <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <Input name="image" type="file" accept="image/*" onChange={handleImageChange}/>
                    <div>
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="New Upload" className="rounded-sm"/>
                      ) : (
                        existingImage && <img src={existingImage} alt="Existing Profile" className="rounded-sm"/>
                      )}
                    </div>
                    <p className='validation-error'>{errors.image}</p>
                  </div>
                  
                  <p className='validation-error'>{errors.global}</p>
                  <Button type="submit"
                    style={{backgroundColor:'rgb(24,62,139)'}}>
                    {buttonLoading ? <ButtonLoading /> : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default ProfileUpdate;