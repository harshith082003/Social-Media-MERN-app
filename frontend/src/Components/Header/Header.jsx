import React, { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import {
    Home,
    HomeOutlined,
    Add,
    AddOutlined, 
    SearchOutlined,
    Search,
    AccountCircle,
    AccountCircleOutlined,
} from '@mui/icons-material'

export default function Header() {

    const [tab, setTab] = useState(window.location.pathname);


  return (
    <div className='header'>

        <Link to={'/'} onClick={() => setTab('/')}>           
        { tab === '/' ? <Home style={{ color: 'orange'}}/> : <HomeOutlined/> }           
        </Link>

        <Link to={'/newPost'} onClick={() => setTab('/newPost')}>
            { tab === '/newPost' ? <Add style={{ color: 'orange'}}/> : <AddOutlined/> } 
        </Link>

        <Link to={'/search'} onClick={() => setTab('/search')}>
            { tab === '/search' ? <Search style={{ color: 'orange'}}/> : <SearchOutlined/> } 
        </Link>

        <Link to={'/account'} onClick={() => setTab('/account')}>
            { tab === '/account' ? <AccountCircle style={{ color: 'orange'}}/> : <AccountCircleOutlined/> } 
        </Link>
      
    </div>
  )
}
