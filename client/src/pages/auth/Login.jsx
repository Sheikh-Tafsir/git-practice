import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from '@/components/ui/checkbox';
import ButtonLoading from '@/mycomponents/loading/Loading';
import {useUserContext} from '@/context/UserContext';
import { accessTokenName } from '@/utils/utils';
import { API } from '@/middleware/Api';

const API_PATH = import.meta.env.VITE_API_PATH;

const Login = () => {

    const navigate = useNavigate();
    const {user, setUser} = useUserContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [googleButtonLoading, setGoogleButtonLoading] = useState(false);
    const [googleUser, setGoogleUser ] = useState([]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setButtonLoading(true);
        try{
            const response = await API.post(`${API_PATH}/auth/login`, 
            {
                email,
                password,
                rememberMe,
            })
                    //console.log(response);
            setEmail('');
            setPassword('');
            setRememberMe(false);
            setErrors([])

            setAccessToken(response.data.data);
        } catch(error){
            if(error.response?.data){
                setErrors(error.response.data);
            } else{
                setErrors({ global: error.message });
              }
            //console.log(error);
        } finally {
            setButtonLoading(false);
        }
    };

    //google login
    const handleGoogleAuth= useGoogleLogin({
        onSuccess: (codeResponse) => setGoogleUser(codeResponse),
        onError: (error) => {
            //console.log('Login Failed:', error);
            setLoginStatus('Login Failed');
        }
    });

    useEffect(
        () => {
            if (googleUser && JSON.stringify(googleUser) != '[]') {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${googleUser.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        //console.log(res.data);
                        const response = res.data;
                        if(response.email)handleGoogleLogin(response.email)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ googleUser ]
    );

    const handleGoogleLogin = async (gmail) => {  
        try{
            setGoogleButtonLoading(true);
     
            const response = await API.post(`${API_PATH}/auth/google-login`, 
            {
                email: gmail,
            })
            //console.log(response);
                
            console.log(response.data);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrors([]);

            setAccessToken(response.data.token);
        } catch(error){
            if(error.response.data){
                setErrors(error.response.data);
            }
        } finally {
            setGoogleButtonLoading(false);
        }
    }

    const setAccessToken = (token) => {
        localStorage.setItem(accessTokenName, token);                
        const user = jwtDecode(token);
        setUser(user);
    }    
    
    //navigate after auth
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            navigate('/', { replace: true });
        }
    }, [user]);

  return (
    <div className='lg:flex h-[100vh]  overflow-hidden'>
        <div className='flex w-full lg:w-[50%] h-full'>   
            <Card className="mx-auto my-auto w-[420px] pb-8">             
                <form onSubmit={handleLogin}>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                        Good to see you again
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" placeholder="ex something12@gmail.com" value={email} onChange={(event) => {setEmail(event.target.value);}}/>
                            <p className='validation-error'>{errors.email}</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" placeholder="ex rahul123" value={password} onChange={(event) => {setPassword(event.target.value);}} />
                            <p className='validation-error'>{errors.password}</p>
                        </div>
                        
                        <div className='flex justify-between w-full'>
                            <div className="flex items-center space-x-2">
                                <Checkbox onChange={(event) => {setRememberMe(!rememberMe)}}/>
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remeber Me?
                                </label>
                            </div>

                            <div className=''>
                                <Link to="/auth/forgotpassword" className='text-sm'>Forgot Password?</Link>
                            </div>
                        </div>
                        
                        {/* {loginStatus && <p className='text-red-600 text-center'>{loginStatus}</p>} */}
                        <p className='validation-error'>{errors.global}</p>
                    </CardContent>

                    <CardFooter className="">
                        <Button type="submit" className="w-full">
                            { buttonLoading? 
                                <ButtonLoading/>:
                                'Login'
                            }
                        </Button>
                    </CardFooter>
                </form>
                
                <p className='text-center mb-2'>or login with </p> 
                <div className='flex'>
                    <Button onClick={handleGoogleAuth}
                    className="w-[90%] mx-auto" variant="outline"
                    >
                        {googleButtonLoading? 
                            <ButtonLoading/>:
                            <div className='flex'>
                                <FcGoogle className='my-auto mr-2 text-xl'/>
                                <p>Google</p>
                            </div>
                        }
                    </Button>
                </div>

                <div className='flex mt-4'>
                    <Link to="/auth/signup" className='flex mx-auto text-sm'>
                        Don't have an account? <p className='text-blue-900 ml-1'>Signup</p>
                    </Link>
                </div>
            </Card>
        </div>

        <div className='lg:w-[50%]'>
            <img src='https://img.freepik.com/premium-vector/illustration-cartoon-female-user-entering-login_241107-682.jpg?w=740' 
            className='cover h-full w-full'/>
        </div>
    </div>
  )
}

export default Login;