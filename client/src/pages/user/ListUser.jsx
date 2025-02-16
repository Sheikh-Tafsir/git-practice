import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pencil, View, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AlertComponent from "@/mycomponents/AlertComponent";
import PageLoading from "@/mycomponents/loading/PageLoading";
import { formatDate } from "@/utils/utils";
import { API } from "@/middleware/Api";
import { PaginationButton } from "@/mycomponents/PaginationButton";
import { useNavigationUtils } from "@/middleware/NavigationUtils"

const API_PATH = import.meta.env.VITE_API_PATH;

const ListUser = () => {
    
    const navigate = useNavigate(); 
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { navigateError } = useNavigationUtils();
    
    const page = queryParams.get('page') || 1;
    const [pageLoading, setPageLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [maxPage, setMaxPage] = useState(1);

    // Fetch students using axios
    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try{
            const response = await API.get(`${API_PATH}/users?page=${page}`);
            //console.log(response.data);
            setUsers(response.data.data);
            setMaxPage(response.data.totalCount);
            setErrors([]);
        } catch(error) {
            //console.error('Error fetching designation:', error);
            navigateError(error);

            if(error.response?.data){
                setErrors(error.response.data);
            } else{
                setErrors({ global: error.message });
            }
        } finally {
            if(pageLoading)setPageLoading(false);
        }
    }

    const handleCreate = () => {
        navigate(`/admin/users/create`);
    };

    const handleShow = (user) => {
        navigate(`/admin/users/${user.id}`);
    };

    const handleEdit = (user) => {
        navigate(`/admin/users/${user.id}/edit`, { state: {user} });
    };

    const handleDelete = async () => {
        const userId = selectedUser.id;
        setUsers((prev) => prev.filter((user) => user.id !== userId));

        try{
            await API.put(`${API_PATH}/users/delete/${userId}`);
        } catch(error) {
            //console.error(error);
            if(error.response.data){
                setErrors(error.response.data);
            } else{
                setErrors({ global: error.message });
            }
        }
    };

    const sortData = (key) => {
        let direction = 'asc';
    
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
  
        setSortConfig({ key, direction });
    
        const sortedData = [...users].sort((a, b) => {
            if (key === 'createdAt' || key === "updatedAt") {
                const dateA = new Date(a[key]);
                const dateB = new Date(b[key]);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (key === 'name') {
                const fieldA = a[key].toLowerCase();
                const fieldB = b[key].toLowerCase();
                if (fieldA < fieldB) return direction === 'asc' ? -1 : 1;
                if (fieldA > fieldB) return direction === 'asc' ? 1 : -1;
                return 0;
            } else if (key === 'experimentCount' || key === 'age') {
              return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
        });
    
        setUsers(sortedData);
    };

  return (
    <div className="min-h-[100vh] pt-20 md:pt-28 bg-gray-100">
        <h2 className="text-center text-3xl">Users</h2>
        <div className="h-1 w-[25%] md:w-[15%] lg:w-[12%] xl:w-[8%] mx-auto mt-1" style={{ backgroundColor: 'rgb(24,62,139)' }}></div>
    
        <div className="w-full md:max-w-[90%] mx-auto p-4">
            <Button className="mb-6" style={{backgroundColor: "rgb(24,62,139"}}onClick={()=> handleCreate()}>Create</Button>

            <Table className="border bg-white">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="flex cursor-pointer"><p className="my-auto">Id</p><ArrowUpDown className="my-auto transform scale-60"/></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="flex cursor-pointer" onClick={()=> sortData('updatedAt')}>
                            <p className="my-auto">Updated At</p><ArrowUpDown className="my-auto transform scale-60"/>
                        </TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                
                <TableBody>
                    {pageLoading ?
                        <TableRow>
                            <TableCell colSpan = {7}>
                                <PageLoading/>
                            </TableCell>
                        </TableRow>
                        :
                        <>
                        {users && users.length > 0? (
                        users.map((user, index) => (
                            <TableRow key={index} onClick={() => setSelectedUser(user)}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.name}</TableCell>                            
                                <TableCell>{formatDate(user.updatedAt)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShow(user)}
                                        className="hover:bg-green-600 text-green-600 hover:text-white"
                                    >
                                        <View className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(user)}
                                        className="hover:bg-blue-600 text-blue-600 hover:text-white"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertComponent
                                        onConfirm={handleDelete}     
                                        status = "4"
                                    />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Empty
                            </TableCell>
                        </TableRow>
                        )}
                        </>
                    }
                </TableBody>
            </Table>
            
            <PaginationButton page={page} totalPages={maxPage} link="/admin/users" />
            
            <p className="validation-error text-center">{errors.global}</p>
        </div>
    </div>
  );
};

export default ListUser;