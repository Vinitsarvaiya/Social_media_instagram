import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import profileImage from '../Assets/profile.jpg';
import { memo } from 'react';
import { FaHome, FaUser, FaSearch, FaPlus, FaBell, FaUsers,FaList } from 'react-icons/fa'; // Import icons

const Navbar = ({ navupdate }) => {
    // console.log(navupdate.image)
  const [image, setImage] = useState(null);
  const [checkimage, setCheckImage] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`);
        const { user } = response.data;
        console.log(user.image)
        setImage(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${user.image}`);
        setCheckImage(user.image);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [navupdate]);

//   useEffect(()=>{
//         setImage(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${navupdate.image}`);
//   },[navupdate])

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const Hnadlelogout=()=>{
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("key");
    navigate('/')
  }

  return (
    <div className="navbar-container">
      <div className="navbar-profile">
        <img
          src={checkimage ? image : profileImage}
          alt="Profile"
        />
      </div>
      <div className="navbar-username">{user.fullname}</div>
      <ul>
        <li onClick={() =>navigate('/profilepage')} className={getLinkClass('/profilepage')}>
          <FaUser className="icon" />
          <span className="navbar-link">Profile</span>
        </li>
        <li onClick={() =>navigate('/search')} className={getLinkClass('/search')}>
          <FaSearch className="icon" />
          <span className="navbar-link">Search</span>
        </li>
        <li onClick={() =>navigate('/createpost')} className={getLinkClass('/createpost')}>
          <FaPlus className="icon" />
          <span className="navbar-link">Create</span>
        </li>
        <li onClick={() =>navigate('/home')} className={getLinkClass('/home')}>
          <FaHome className="icon" />
          <span className="navbar-link">Home</span>
        </li>
        <li onClick={() =>navigate('/requestlist')} className={getLinkClass('/requestlist')}>
          <FaBell className="icon" />
          <span className="navbar-link">Request</span>
        </li>
        <li onClick={() =>navigate('/profile')} className={getLinkClass('/profile')}>
          <FaList className="icon" />
          <span className="navbar-link">Post</span>
        </li>
        <li onClick={() =>navigate('/follower')} className={getLinkClass('/follower')}>
          <FaUsers className="icon" />
          <span className="navbar-link">Follower</span>
        </li>
        <li onClick={() =>navigate('/following')} className={getLinkClass('/following')}>
          <FaUsers className="icon" />
          <span className="navbar-link">Following</span>
        </li>
      </ul>
      <button type="button" className='btn btn-primary btn-block' style={{width:"180px",marginTop:"170px"}} onClick={Hnadlelogout}>Logout</button>
    </div>
  );
};

export default memo(Navbar);