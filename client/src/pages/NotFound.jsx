import React from 'react'
import Shooping from '../Icon/Shooping'

export default function NotFound() {
  return (
    <div className='flex items-center justify-center h-screen text-xl'>
      <div className='text-center'>
        <Shooping className="h-10 mx-auto mb-4" />
        Sorry, URL Not Found!!
      </div>
    </div>
  )
}
   