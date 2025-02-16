import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import ButtonLoading from '@/mycomponents/loading/Loading.jsx';
import { API } from '@/middleware/Api';

const API_PATH = import.meta.env.VITE_API_PATH;

const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
    
        if (formData.password !== confirmPassword) {
          setErrors({ confirmPassword: "Password and confirm password don't match" });
          return;
        }
    
        setButtonLoading(true);
        try {
          await API.post(`${API_PATH}/users`, {
            formData,
          });
    
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          setErrors([]);

          navigate(`/users`, { replace: true });
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
    <div className='lg:flex h-[100vh]'> 
        <div className='lg:w-[50%]'>
            <img src='https://static.vecteezy.com/system/resources/thumbnails/005/879/539/small_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg' 
            className='cover h-full w-full'/>
        </div>

        <div className='flex w-full lg:w-[50%] h-full'>
            <Card className="mx-auto my-auto w-[450px]">             
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Signup</CardTitle>
                        <CardDescription>
                            Register as user
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="flex">Name<p className='text-red-600'>*</p></Label>
                            <Input 
                                type="text" 
                                name="name" 
                                placeholder="John smith" 
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
                                placeholder="something12@gmail.com" 
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
                                placeholder="8 characters min" 
                                value={formData.password} 
                                onChange={handleChange}
                            />
                            <p className='validation-error'>{errors.password}</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="flex">Confirm Password<p className='text-red-600'>*</p></Label>
                            <Input type="password" 
                                name="confirmPassword"
                                placeholder="8 characters min" 
                                value={confirmPassword} 
                                onChange={(event) => {setConfirmPassword(event.target.value);}} 
                            />
                            <p className='validation-error'>{errors.confirmPassword}</p>
                        </div>

                        <p className='validation-error'>{errors.global}</p>
                    </CardContent>

                    <CardFooter className="flex-col">
                        <Button type="submit" className="w-full"
                            style={{backgroundColor:'rgb(24,62,139)'}}>
                            { buttonLoading? 
                                <ButtonLoading/>:
                                'Save'
                            }
                        </Button>

                        <div className='flex mt-4'>
                            <Link to="/auth/login" className='flex mx-auto text-sm'>
                                Already have an account? <p className='text-blue-900 ml-1'>Login</p>
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </div>
  )
}

export default Signup;