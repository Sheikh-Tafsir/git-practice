import { Outlet, Navigate } from 'react-router-dom'

import { isLoggedIn } from '../utils/utils';
import NavigationBar from '@/mycomponents/NavigationBar';

const RouteLoggedIn = () => {

    return(
        isLoggedIn() ? 
            <main>
            <NavigationBar />
            <Outlet/>
            </main>
            : 
            <Navigate to="/auth/login" />
    )
}

export default RouteLoggedIn