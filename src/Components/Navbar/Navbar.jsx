// src/Components/navbar/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import more_icon from '../../assets/more.png';
import notification_icon from '../../assets/notification.png';
import profile_icon from '../../assets/jack.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/search?search_query=${encodeURIComponent(trimmedQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className='flex-div'>
            <div className='nav-left flex-div'>
                <img
                    className='menu-icon'
                    onClick={() => setSidebar(prev => !prev)}
                    src={menu_icon}
                    alt="Menu"
                />
                <Link to='/'>
                    <img className='logo' src={logo} alt="YouTube Logo" />
                </Link>
            </div>

            <div className="nav-middle flex-div">
                <form onSubmit={handleSearch} className="search-box flex-div">
                    <input
                        type="text"
                        placeholder='Search'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search YouTube"
                    />
                    <button type="submit" className="search-button">
                        <img src={search_icon} alt="Search" />
                    </button>
                </form>
            </div>

            <div className="nav-right flex-div">
                <img src={upload_icon} alt="Upload" />
                <img src={more_icon} alt="More options" />
                <img src={notification_icon} alt="Notifications" />
                <img src={profile_icon} className='user-icon' alt="User profile" />
            </div>
        </nav>
    );
};

export default Navbar;