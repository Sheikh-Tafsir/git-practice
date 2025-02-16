import React from 'react'
import { Outlet} from 'react-router-dom'

import Footer from '@/mycomponents/Footer'
import NavigationBar from '@/mycomponents/NavigationBar'

const RoutePublic = () => {
    return(
        <>
          <NavigationBar />
          <Outlet/> 
          <Footer />
        </>
    )
}

export default RoutePublic