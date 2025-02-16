import { Outlet, Navigate } from 'react-router-dom'

import NavigationBar from '@/mycomponents/NavigationBar';
import { checkLoggedInUser } from '../utils/utils';

const RouteAdmin = () => {
    const user = checkLoggedInUser();
    return(
        user && user?.roleId == 1 ? 
            <main>
            <NavigationBar />
            <Outlet/>
            </main>
            : 
            <Navigate to="/" />
    )
}

export default RouteAdmin