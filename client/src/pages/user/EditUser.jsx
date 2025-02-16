import { useState, useEffect } from "react";
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
import { useParams, useNavigate } from 'react-router-dom';
import PageLoading from "@/mycomponents/loading/PageLoading";
import ButtonLoading from "@/mycomponents/loading/Loading";
import { formatDate, imageToByte } from "@/utils/utils";
import { useNavigationUtils } from '@/middleware/NavigationUtils';
import { API } from "@/middleware/Api";

const API_PATH = import.meta.env.VITE_API_PATH;

const EditUser = () => {

  const { id } = useParams(); 
  const navigate = useNavigate();
  const { navigateError } = useNavigationUtils();

  const [roles, setRoles] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    if(pageLoading)getRoles();
  }, []);

  useEffect(() => {
    if (id) { 
      fetchProfile();
    }
  }, [id]);
  
  const getRoles = async () => {
      try{
          const response = await API.get(`${API_PATH}/roles`);
          setRoles(response.data.data);
      } catch(error) {
          //console.error('Error fetching designation:', error);
          if(error.response.data){
            setErrors(error.response.data);
          } else {
            setErrors({ global: error.message });
          }
      }
  }

  const fetchProfile = async () => {
    try {
      const response = await API.get(`${API_PATH}/users/${id}`);
      //console.log(response.data.data);
      const responseData = response.data.data
      if(!responseData)navigateError();
      setFormData((prevData) => ({
        ...prevData,
        name: responseData.name || '',
        roleId: responseData.roleId || '',
        designation: responseData.designation || '',
        phone: responseData.phone || '',
        image: responseData.image || '',
      }));
      setExistingImage(responseData?.image);
      setViewData(responseData);
      setErrors([]);
    } catch (error) {
      //console.error("Error fetching profile data:", error);
      navigateError(error);
      setErrors({ global: error.message });
      
    } finally{
      setPageLoading(false);
    }
  };

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

      await API.put(`${API_PATH}/users/${id}`, {
        ...formData,
        image,
      });
      navigate(`/admin/users`);
    } catch (error) {
      //console.error("Error uuser profile:", error);
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
    <div className="flex min-h-[100vh] bg-gray-200 pt-24">
      <Card className="w-[400px] bg-white mx-auto">
        {pageLoading ? (
          <PageLoading />
        ) : (
          <>
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
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
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <p className='validation-error'>{errors.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="flex">Role<p className='text-red-600'>*</p></Label>                         
                      <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        className="border rounded-md p-2 bg-white w-full"
                      >
                        <option value="" disabled>
                            -- Select Role --
                        </option>
                          {roles.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      <p className='validation-error'>{errors.roleId}</p>
                    </div>

                   <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <Input name="image" type="file" accept="image/*" onChange={handleImageChange}/>
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="New Upload" className="rounded-sm"/>
                    ) : (
                      existingImage && <img src={existingImage} alt="Existing Profile" className="rounded-sm"/>
                    )}
                    <p className='validation-error'>{errors.image}</p>
                  </div>

                  <div>
                    <Label htmlFor="">Created By</Label>
                    <p>{viewData?.UserCreatedBy?.name}</p>
                  </div>

                  <div>
                    <Label htmlFor="">Created At</Label>
                    <p>{formatDate(viewData.createdAt)}</p>
                  </div>

                  <div>
                    <Label htmlFor="">Updated By</Label>
                    <p>{viewData?.UserUpdatedBy?.name}</p>
                  </div>

                  <div>
                    <Label htmlFor="">Updated At</Label>
                    <p>{formatDate(viewData.updatedAt)}</p>
                  </div>

                  <div>
                    <Label htmlFor="">Deleted</Label>
                    <p>{viewData.deleted == false ? "false" : "true"}</p>
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

export default EditUser;