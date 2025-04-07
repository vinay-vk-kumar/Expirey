import { useEffect, useState } from 'react';
import { Button, TextInput, PasswordInput, Group, Box, Flex } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';
import { ToastContainer, toast } from 'react-toastify';
import { BACKNED_URL } from '../../config';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import Shooping from '../Icon/Shooping';


export function SignIn() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
        email: '',
        password: '' 
    },
    validate: {
      email: isEmail('Invalid email'),
      password: hasLength({ min: 8 }, 'Must be at least 8 characters')
    }
  });   
  
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem("authorization");
    console.log(token)
    if (token) {
        const response = axios.get(`${BACKNED_URL}/api/v1/user/validate-token`, {
            headers: { Authorization: token },
        })
        .then((response) => {

            console.log(response.data)
            if(response.data.success){
                navigate("/dashboard"); // Redirect if token is valid
            } else{
                localStorage.removeItem("authorization"); // Remove invalid token
            }
        })
        .catch(() => {
            localStorage.removeItem("authorization"); // Remove invalid token
        });
    }
    setLoading(false)

}, []);

  const handleSubmit = async (values) => {
    setLoading(true)
    try{
        const response = await axios.post(`${BACKNED_URL}/api/v1/user/signin`,{
            email: values.email,
            password: values.password
        });
        toast(response.data.message)
        if(response.data.success){
            localStorage.setItem("authorization",response.data.token);
            setTimeout(() => {
                navigate("/dashboard")
            }, 1000)
        }

    } catch(e){
        toast(e.response.data.message)
        console.log(e.message)
    } finally{
        setLoading(false)
    }
  }


  return (
    <>
        <div className=''>
            <div className="flex justify-center itmes-center mt-20 mb-17 text-[#FFF8F8] text-2xl" >
                {<Shooping className="h-10 mb-2" />}Sign In
            </div>
        
            <div className='flex justify-center items-center' h='100vh'>
                <Box miw='300px'>
                    <form onSubmit={form.onSubmit(handleSubmit)}>

                        <TextInput
                            {...form.getInputProps('email')}
                            key={form.key('email')}
                            mt="md"
                            label="Email"
                            placeholder="Email"
                        />

                        <PasswordInput
                            className='mt-4'
                            label="Password"
                            placeholder="Password"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                            />

                        <Group justify="flex" className='mt-6'>
                            <Button type="submit" loading={loading} fullWidth={true} >Submit</Button>
                        </Group>
                    </form>
                </Box>
            </div>
            
        </div>
        <ToastContainer />
        <div className="flex justify-center items-center pt-6 text-[#FFF8F8]">
            <div className="pr-2 ">
                New User?    
            </div> 
            <Link to="/signup" className="text-blue-300 text drop-shadow-xl">Sign Up</Link>
        </div>
    </>
  );
}