import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button.jsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select.jsx"
import {useUserContext} from '@/context/UserContext';
import ButtonLoading from '@/mycomponents/loading/Loading.jsx';
import { imageToByte } from '@/utils/utils';
import { useNavigationUtils } from '@/middleware/NavigationUtils';
import { API } from '@/middleware/Api';

const API_PATH = import.meta.env.VITE_API_PATH;

const SaveUser = () => {

    const navigate = useNavigate();
    const {userInfo} = useUserContext();
    const { navigateError } = useNavigationUtils();

    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        roleId: '',
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if(pageLoading)getRoles();
    }, []);

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
        } finally {
            setPageLoading(false);
        }
    }

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

    const handleSave = async (e) => {
        e.preventDefault();
    
        if (formData.password !== confirmPassword) {
          setErrors({ confirmPassword: "Password and confirm password don't match" });
          return;
        }
    
        setButtonLoading(true);
        try {

          const image = imageFile? await imageToByte(imageFile) : null;

          await API.post(`${API_PATH}/users`, {
            ...formData,
            image,
            createdBy:userInfo.id,
            updatedBy:userInfo.id,
            
          });
    
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            designation: '',
            roleId: '',
          });
          setErrors([]);

          navigate(`/admin/users`, { replace: true });
        } catch (error) {
            //console.log(error.message);
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
    <div className='lg:flex min-h-[100vh] pt-20 md:pt-24 pb-8'> 
            <Card className="mx-auto my-auto w-[450px]">             
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Signup</CardTitle>
                        <CardDescription>
                            Add new user
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="flex">Name<p className='text-red-600'>*</p></Label>
                            <Input 
                                type="text" 
                                name="name" 
                                placeholder="ex John smith" 
                                value={formData.name} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.name}</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email" className="flex">Email<p className='text-red-600'>*</p></Label>
                            <Input 
                                type="email" 
                                name="email" 
                                placeholder="ex something12@gmail.com" 
                                value={formData.email} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.email}</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="flex">Password<p className='text-red-600'>*</p></Label>
                            <Input 
                                type="password" 
                                name="password" 
                                placeholder="ex rahul123" 
                                value={formData.password} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.password}</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="flex">Confirm Password<p className='text-red-600'>*</p></Label>
                            <Input type="password" 
                                name="confirmPassword"
                                placeholder="ex rahul123" 
                                value={confirmPassword} 
                                onChange={(event) => {setConfirmPassword(event.target.value);}} 
                            />
                            <p className='validation-error'>{errors.confirmPassword}</p>
                        </div>

                        <div className="space-y-1">
                            <Label>Phone</Label>
                            <Input 
                                type="text" 
                                name="designation" 
                                placeholder="ex 01846328626" 
                                value={formData.phone} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.phone}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="flex">Designation<p className='text-red-600'>*</p></Label>
                            <Input 
                                type="text" 
                                name="designation" 
                                placeholder="ex IT technician" 
                                value={formData.designation} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.designation}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="flex">Role<p className='text-red-600'>*</p></Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                                </SelectTrigger>

                                <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className='validation-error'>{errors.roleId}</p>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="image">Image</Label>
                            <Input type="file" accept="image/*" onChange={handleImageChange}/>
                            <div className=''>
                                {imageFile && (
                                    <img src={URL.createObjectURL(imageFile)} alt="New Upload" 
                                    className="rounded-sm w-[50%]"/>
                                )}
                            </div>
                            <p className='validation-error'>{errors.image}</p>
                        </div>

                        <p className='validation-error'>{errors.global}</p>
                    </CardContent>

                    <CardFooter className="">
                        <Button type="submit" className="w-full"
                            style={{backgroundColor:'rgb(24,62,139)'}}>
                            { buttonLoading? 
                                <ButtonLoading/>:
                                'Save'
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Card>
    </div>
  )
}

export default SaveUser;