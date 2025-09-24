import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutAdmin = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <main className='main'>
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutAdmin