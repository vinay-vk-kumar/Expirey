
import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function () {
    const navigate = useNavigate();
    
    setTimeout(() => {
        navigate("/signin")
    },500)
        
    return (
    <div></div>
  )
}
