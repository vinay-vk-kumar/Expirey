import React, { useEffect, useState } from 'react'
import Shooping from '../Icon/Shooping'
import { Button } from '@mantine/core'
import PlusIcon from '../Icon/PlusIcon'
import Card from '../Components/Card'
import { AddContentModal } from '../Components/AddContentModal'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { BACKNED_URL } from '../../config'
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false)
    const [message, setMessage] = useState(null)
    const [result, setResult] = useState([])
    const [Name, setName] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (message?.text) {
            toast(message.text, {
                toastId: `${message.text}-${message.id}`
            })
        }
    }, [message?.id])

    const tryUser = () => {
        const token = localStorage.getItem("authorization");
        console.log(token)
        if (token) {
            const response = axios.get(`${BACKNED_URL}/api/v1/user/validate-token`, {
                headers: { Authorization: token },
            })
            .then((response) => {
    
                console.log(response.data)
                if(!response.data.success){
                    navigate("/signin"); // Redirect if token is valid
                } else{
                    localStorage.removeItem("authorization"); // Remove invalid token
                }
            })
            .catch(() => {
                localStorage.removeItem("authorization"); // Remove invalid token
            });
        }
    }

    const fetchData = async() => {
        try{
                const token = localStorage.getItem("authorization");
                if (token) {
                    const response = await axios.get(`${BACKNED_URL}/api/v1/expirey/`, {
                        headers: { Authorization: token },
                    })
                    if(response.data){
                        setResult(response.data.result)
                        console.log(response.data)
                        if(response.data.success){
                            console.log("data will be fetched")
                        }
                    }
                }
                else{
                    localStorage.removeItem("autorization");
                    navigate("/signin")
                }
            } catch(e) {
                console.log(e)
            } 
    }

    const fetchName = async () => {
        let response = ""
        try{
            const token = localStorage.getItem("authorization");
            if (token) {
                response = await axios.get(`${BACKNED_URL}/api/v1/user/`, {
                    headers: { Authorization: token },
                })
                if(response.data){
                    setName(response.data.name)
                    console.log(response.data)
                }
            }
            else{
                localStorage.removeItem("autorization");
                navigate("/signin")
            }
        } catch(e) {
            console.log(e)
            console.log(e.response.data.message)
        } 
    }

    useEffect(() => {
        let interval;
        try{
            tryUser()
            fetchData()
            fetchName()
            interval = setInterval(fetchData, 3 * 1000)
        }
             catch(e){
            console.log(e)
        }
        return () => {
            clearInterval(interval)
        }

    }, [])


  return (
    <div className='min-h-screen'>
        <AddContentModal opened={modalOpen} onClose={() => {
            setModalOpen(false);
        }} setMessage={setMessage} />

        <div className='flex justify-between mx-3'>
            <div className='flex text-center font-black text-black bg-[#FFF8F8] rounded-md mt-2 px-6 pt-3 font-bold cursor-pointer' onClick={() => navigate("/dashboard")}>
                {<Shooping className="h-10 mx-auto mb-2"/>}Expirey
            </div>
            <div className='flex items-center text-center font-black text-black bg-[#FFF8F8] rounded-md mt-2 px-15 mb-2 pb-2 font-bold cursor-pointer'>
                Hi, {Name}
            </div>
        </div>

        <div className='border-t-4 mt-9    '>
        </div>

        <div className='mt-10'>
            <div className='flex justify-between mx-8 items-center'>
                <div className='text-[#FFF8F8] text-xl '>
                    Your Items  
                </div>

                <div>
                    <Button type='submit' size='md' color='green' rightSection={<PlusIcon /> } onClick={() => setModalOpen(true)}>Add New Entry</Button>
                </div>
            </div>

            <div>
            <Card result={result} setMessage={setMessage} setResult={setResult} />
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}
