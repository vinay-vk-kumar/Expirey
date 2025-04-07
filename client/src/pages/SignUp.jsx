import { useState } from 'react';
import { Button, TextInput, PasswordInput, Group, Box, Flex } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';
import axios from 'axios';
import { BACKNED_URL } from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Shooping from '../Icon/Shooping';

export function SignUp() {
    const navigate = useNavigate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
        name: '', 
        email: '',
        password: '',
        confirmPassword: '' },
    validate: {
      name: hasLength({ min: 2 }, 'Must be at least 2 characters'),
      email: isEmail('Invalid email'),
      password: hasLength({ min: 8 }, 'Must be at least 8 characters'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const handleSubmit = async (values) => {
    try{
        localStorage.removeItem("authorization")
        const response = await axios.post(`${BACKNED_URL}/api/v1/user/signup`,{
            name: values.name,
            email: values.email,
            password: values.password
        });
        toast(response.data.message)
        if(response.data.success){
            setTimeout(() => {
                navigate("/signin")
            }, 1000)
        }

    } catch(e){
        toast(e.response.data.message)
        console.log(e.message)
    }
  }
  
  return (
    <>
        <div className=''>
            <div className="flex justify-center itmes-center mt-20 mb-17 text-[#FFF8F8] text-2xl" >
                {<Shooping className="h-10 mb-2" />}Sign Up
            </div>
        
            <div className='flex justify-center items-center' h='100vh'>
                <Box miw='300px'>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            {...form.getInputProps('name')}
                            key={form.key('name')}
                            label="Name"
                            placeholder="Name"
                        />

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

                        <PasswordInput
                        mt="sm"
                        label="Confirm password"
                        placeholder="Confirm password"
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
                        />

                        <Group justify="flex-end" className='mt-6'>
                            <Button type="submit" fullWidth={true} >Submit</Button>
                        </Group>
                    </form>
                </Box>
            </div>
            
        </div>
        <div className="flex justify-center items-center pt-6 text-[#FFF8F8]">
            <div className="pr-2 ">
                Already a user?    
            </div> 
            <Link to="/signin" className="text-blue-300 text drop-shadow-xl">Sign In</Link>
        </div>
        <ToastContainer />
    </>
  );
}