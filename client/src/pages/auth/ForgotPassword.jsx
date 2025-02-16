import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
import ButtonLoading from '@/mycomponents/loading/Loading';
const API_PATH = import.meta.env.VITE_API_PATH;

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleForgotPassword = () => {
        const response = axios.post("");
        setLoginStatus(response.data.data.message);
    }

  return (
    <div className='lg:flex h-[100vh]  overflow-hidden'>
        <div className='flex w-full lg:w-[50%] bg-gray-100 h-full'>     
            <Card className="mx-auto my-auto w-[420px]">             
                <form onSubmit={handleForgotPassword}>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                        Good to see you again
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                        <Label htmlFor="name">Email</Label>
                        <Input type="email" placeholder="ex something12@gmail.com" value={email} onChange={(event) => {setEmail(event.target.value);}} required/>
                        </div>
                        
                        {loginStatus && <p>{loginStatus}</p>}
                    </CardContent>

                    <CardFooter className="flex-col gap-2 ">
                        <Button type="submit" className="w-full">
                            { buttonLoading? 
                                <ButtonLoading/>:
                                'Send'
                            }
                        </Button>
                        <Link to="/login" className='text-sm'>Remember Password?</Link>
                    </CardFooter>
                </form>
            </Card>
        </div>

        <div className='lg:w-[50%]'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSni4W_ssx3U1KqS7a7wY_Q4NVU2hW3CP-1jA&s' 
            className='cover h-full w-full'/>
        </div>
    </div>
  )
}

export default ForgotPassword
