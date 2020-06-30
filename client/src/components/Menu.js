import React,{Fragment} from 'react';
import logo from '../image/logo.png';
import { Link } from 'react-router-dom';

const Menu = (props) =>{
    
    
    const logout = () =>{
        localStorage.removeItem("userData");
        alert("로그아웃 되었습니다.");
        props.history.push('/');
    }


    
    return (
        <header>
            <Link to="/"><div className="logo"><img src={logo} alt="logo" /></div></Link>
            <div className="login">
                {
                JSON.parse(localStorage.getItem('userData')) === null ? <Fragment><Link to="/user/login">로그인</Link><Link to="/user/join">회원가입</Link></Fragment> 
                : 
                <Fragment><span className="menu-info">{JSON.parse(localStorage.getItem('userData')).user_name}님</span><Link to="#" onClick={logout}>로그아웃</Link></Fragment>
                }
            </div>
        </header>
    );
    
}


export default Menu;