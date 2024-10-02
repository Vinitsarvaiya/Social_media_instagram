import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileImage from '../../Assets/profile.jpg'; // default profile image
import './ProfilePage.css'

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [checkimage,setcheckimage] = useState(null)
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);
  const token = sessionStorage.getItem("key");
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`);
      console.log(response.data.user)
      setUserData(response.data.user);
      setcheckimage(response.data.user.image)
      setImage(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${response.data.user.image}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/userpost`);
      console.log(response.data.post)
      setPosts(response.data.post);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const Handledelte=(e)=>{
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/delete`,{id:e})
        .then((response) => {
            console.log(response.data.message)
            fetchUserPosts()
        })
        .catch()
}

  const Profileupdate = () => {
    navigate('/profileupdate')
}

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={checkimage?image:profileImage}
            alt={profileImage}
            className="rounded-circle"
            onClick={Profileupdate}
            width={"120px"}
            height={"120px"}
          />
        </div>
        <div className="profile-info">
          <h2>{userData.fullname}</h2>
          <div className="profile-stats">
            <span>{posts?.length||0} Posts</span>
            {console.log(userData.follower)}
            <span>{userData.follower?userData.follower.filter(data=>data.status === "accepted").length:0} Followings</span>
            <span>{userData.following?userData.following.filter(data=>data.status === "accepted").length:0} Followers</span>
          </div>
        </div>
      </div>

      <div className="profile-posts">
        <h3>Your Posts</h3>
        <div className="posts-grid">
        {Array.isArray(posts) && posts && posts.map((item, index) => {
                                            return (
                                                <div className="card col-4 mx-3 mb-3 mt-3" style={{"width":"300px","height":"350px"}} key={index}>
                                                <img className="card-img-top" src={`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/postimage/${item.id}`} alt="Card" height={"200px"}/>
                                                <div className="card-body">
                                                  <h4 className="card-title">{item.title}</h4>
                                                  <p className="card-text">{item.description}</p>
                                                  <button className="btn btn-secondary" onClick={()=>Handledelte(item.id)} >delete</button>
                                                </div>
                                              </div>
                                            )
                                        })} 
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
