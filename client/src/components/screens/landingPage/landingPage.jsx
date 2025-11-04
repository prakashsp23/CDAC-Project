import React from 'react'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'

function LandingPage() {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold'>this is landing page use the below buttons to navigate to the different pages</h1>
            <div className='flex gap-8 p-8'>
                <Link to="/admin">
                    <Button>Admin</Button>
                </Link>
                <Link to="/customers">
                    <Button>Customers</Button>
                </Link>
                <Link to="/mechanic">
                    <Button>Mechanic</Button>
                </Link>
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
                <Link to="/register">
                    <Button>Register</Button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage