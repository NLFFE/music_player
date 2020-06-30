import React from 'react';
import { Link } from 'react-router-dom';
const SideMenu = () => {
    return (
        <div className="side-bar">
            {JSON.parse(localStorage.getItem('userData')) != null ? <Link to="/music/add">음악 추가하기 </Link> : ''}
        </div>
    );
};

export default SideMenu;