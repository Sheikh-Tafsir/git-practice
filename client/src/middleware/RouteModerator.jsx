import { Outlet, Navigate } from 'react-router-dom'

import NavigationBar from '@/mycomponents/NavigationBar';
import { checkLoggedInUser } from '../utils/utils';

const RouteModerator = () => {
    const user = checkLoggedInUser();
    return(
        user && user?.roleId <= 2  && user?.roleId > 0? 
            <main>
            <NavigationBar />
            <Outlet/>
            </main>
            : 
            <Navigate to="/" />
    )
}

export default RouteModerator