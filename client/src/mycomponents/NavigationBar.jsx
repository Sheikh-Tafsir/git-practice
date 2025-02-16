import React, {useState} from 'react'
import { Link } from 'react-router-dom'

import {
  LogOut,
  Menu, 
  X, 
  ChevronDown,
} from "lucide-react"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useUserContext} from '@/context/UserContext';
import { isLoggedIn } from '@/utils/utils'
import { handleLogout } from '@/middleware/Api'

const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'Service',
    href: '#',
    dropdownItems: [
     
    ],
  },
]

const navItemsLoggedProfile = [
  { name: 'Profile', href: '/profile' },
]

const navItemsLogged = [
  { name: 'Chatbot', href: '/chatbot' },
  { name: 'Task', href: '/tasks' },
]

const navItemsModerator = [

]

const navItemsAdmin = [

]

export default function Navbar() {
  const {user} = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white shadow fixed top-0 z-50 md:py-1 overflow-x-hidden"
      style={{ backgroundColor: 'rgb(24,62,139)' }}>
      {/* pc menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full justify-between">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800 text-white">
                <div className='flex'>
                  <img src="/navbar/icon3.png" className="h-12 w-12" alt="logo"/>
                  <p className='my-auto ml-2'>Aspire</p>
                </div>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-2 lg:space-x-6 h-full items-center">
              {navItems.map((item) => (
                <div key={item.name} className="flex items-center">
                  {item.dropdownItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                          {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.dropdownItems.map((dropdownItem) => (
                          <DropdownMenuItem key={dropdownItem.name} asChild className="py-3 cursor-pointer">
                            <Link to={dropdownItem.href} className="text-sm font-medium">{dropdownItem.name}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-white py-2 rounded hover:bg-white hover:text-primary inline-flex items-center px-3 h-full text-sm font-semibold"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {user?.roleId == 2 &&
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%]">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                        Moderator<ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsModerator.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>
                            {menu.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }

              {isLoggedIn()  &&
                <div className="hidden sm:ml-6 sm:flex sm:space-x-2 lg:space-x-6 h-full items-center">
                  {navItemsLogged.map((item) => (
                    <div key={item.name} className="flex items-center">
                      {item.dropdownItems ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                              {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {item.dropdownItems.map((dropdownItem) => (
                              <DropdownMenuItem key={dropdownItem.name} asChild className="py-3 cursor-pointer">
                                <Link to={dropdownItem.href} className="text-sm font-medium">{dropdownItem.name}</Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          to={item.href}
                          className="text-white py-2 rounded hover:bg-white hover:text-primary inline-flex items-center px-3 h-full text-sm font-semibold"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              }

              {user?.roleId == 1 &&
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%]">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                        অ্যাডমিন<ChevronDown className="ml-1 h-4 w-4 " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsAdmin.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>
                            {menu.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {navItemsModerator.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>
                            {menu.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }

              <div className="flex items-center">
                {isLoggedIn() ?
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%]">
                      <Button variant="ghost" className="text-white hover:text-primary/80 text-sm font-medium h-full bg-white"
                        style={{color:'rgb(24,62,139)'}}>
                        <p>{user.name}</p>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsLoggedProfile.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href} className="text-sm font-medium">{menu.name}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem asChild className="py-3 cursor-pointer">
                        <Button variant="ghost" onClick={()=> handleLogout()}>Logout</Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  :
                  <Link to="/auth/login" 
                    className="text-white text-primary inline-flex items-center px-3  py-2 h-full text-sm font-medium rounded-sm font-semibold bg-white hover:bg-gray-100"
                    style={{color:'rgb(24,62,139)'}}
                  >
                    Login
                  </Link>
                }
              </div>
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden text-white ">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 h-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="text-white block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="text-white block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 pb-3 pt-2">
          {navItems.map((item) => (
            <div key={item.name} className='text-center'>
              {item.dropdownItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='ml-4'>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">
                      {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.dropdownItems.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.name} asChild className="py-2">
                        <Link to={dropdownItem.href} className="text-sm font-medium">{dropdownItem.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={item.href}
                  className="text-white block px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary/80 font-semibold"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

              {user?.roleId == 2 &&
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%] mx-auto">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                        Moderator<ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsModerator.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>{menu.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }

              {user?.roleId == 1 &&
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%] mx-auto">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium h-full px-3 text-white font-semibold">
                        অ্যাডমিন<ChevronDown className="ml-1 h-4 w-4 " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsAdmin.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>{menu.name}</Link>
                        </DropdownMenuItem>
                      ))}
                      {navItemsModerator.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href}>{menu.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
          
              <div className="flex items-center">
                {isLoggedIn() ?
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-h-[50%] mx-auto">
                      <Button variant="ghost" className="text-white hover:text-primary/80 text-sm font-medium h-full">
                        <img src={user.image? user.image : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        className='h-10 aspect-square rounded-full' />
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {navItemsModerator.map((menu, index) => (
                        <DropdownMenuItem asChild className="py-3 cursor-pointer" key={index}>
                          <Link to={menu.href} className="text-sm font-medium">{menu.name}</Link>
                        </DropdownMenuItem>
                      ))}
                        <DropdownMenuItem asChild className="py-3 cursor-pointer">
                          <Button variant="ghost" onClick={()=> handleLogout()}>Logout</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  :
                  <Link to="/auth/login" 
                    className="text-white text-primary inline-flex items-center px-3  py-2 h-full text-sm font-medium rounded-sm font-semibold mx-auto bg-white"
                    style={{color:'rgb(24,62,139)'}}
                  >
                    Login
                  </Link> 
                }
              </div>
        </div>
      </div>
    </nav>
  )
}