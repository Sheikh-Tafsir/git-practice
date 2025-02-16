import React from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import './App.css'

import { UserProvider} from './context/UserContext';
import RoutePublic from './middleware/RoutePublic';
import RouteAuth from './middleware/RouteAuth'
import RouteLoggedIn from './middleware/RouteLoggedIn';
import RouteAdmin from './middleware/RouteAdmin';
import RouteModerator from './middleware/RouteModerator';

import Homepage from './pages/homepage/Homepage';
import NotFound from './pages/NotFound';
import Error from './pages/Error';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ListUser from './pages/user/ListUser';
import ShowUser from './pages/user/ShowUser';
import SaveUser from './pages/user/SaveUser';
import EditUser from "./pages/user/EditUser";
import Profile from './pages/profile/Profile';
import ProfileUpdate from './pages/profile/ProfileUpdate';
import Chatbot from './pages/chatbot/Chatbot';
import Tasks from './pages/taskSimplifier/Tasks';
import HandwritingCanvas from './pages/HandwritingCanvas';
import Story from './pages/Story';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={ <Homepage />} exact/>

            <Route element={<RouteAuth/>}>
              <Route path="/auth/login" element={<Login />}/>
              <Route path="/auth/forgotpassword" element={<ForgotPassword />}/>
              <Route path="/auth/signup" element={<Signup />}/>
            </Route>

            <Route element={<RoutePublic/>}>
              <Route path="/mousetext" element={<HandwritingCanvas />} />
              <Route path="/story" element={<Story />} />
            </Route>
            
            <Route element={<RouteLoggedIn />}>
              <Route path='profile' element={<Profile/>} />
              <Route path='profile/edit' element={<ProfileUpdate/>} />

              <Route path="/chatbot" element={<Chatbot />} />
              <Route path='/chatbot/:id' element={<Chatbot/>} />

              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<Tasks />} />
            </Route>

            <Route path="/admin" element={<RouteModerator />}>

            </Route>

            <Route path="/admin" element={<RouteAdmin />}>
              <Route path='users' element={<ListUser/>} />
              <Route path='users/:id' element={<ShowUser/>} />
              <Route path="users/create" element={<SaveUser />}/>
              <Route path="users/:id/edit" element={<EditUser />}/>
            </Route>

            <Route path="/error" element={<Error />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App