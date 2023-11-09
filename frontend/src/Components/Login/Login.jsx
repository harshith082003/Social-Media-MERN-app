import { Typography, Button } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Actions/User'

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    
    const loginHandler = (e) => {
        
        e.preventDefault();
        // console.log(email, password);

        dispatch(loginUser(email, password))
        
    }

    return (
        <div className='login'>
            <form className='loginForm' onSubmit={loginHandler}>

                <Typography variant='h3' style = {{ padding: '2vmax'}}>
                    Social App
                </Typography>

                <input type = 'email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                
                <input type = 'password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>

                <Link to={'/forgot/password'}>
                    <Typography>Forgot Password</Typography>
                </Link>

                <Button type='submit'>Login</Button>

                <Link to={'/register'}>
                    <Typography>Register</Typography>
                </Link>
            </form>
        </div>
   )
}
