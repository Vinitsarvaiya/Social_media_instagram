import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import profileImage from '../../Assets/profile.jpg';
import '../UserProfile/ProfilePage.css'

const UserProfilePage = () => {
    const [image, setImage] = useState(null);
    const [checkimage, setcheckimage] = useState(null)
    const [userData, setUserData] = useState([]);
    const [posts, setPosts] = useState([]);
    const [FrUser,setFrUser] = useState([])
    const token = sessionStorage.getItem("key");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const navigate = useNavigate();
    const location = useLocation()
    // console.log(location.state.userid)

    useEffect(() => {
        fetchUserData();
        fetchUserPosts();
        fetchFriendData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/userprofile`, { id: location.state.id });
            // console.log(response.data.user)
            setUserData(response.data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchFriendData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/friendprofile`, { id: location.state.id });
            // console.log(response.data.user)
            setFrUser(response.data.user)
            setcheckimage(response.data.user.image)
            setImage(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${response.data.user.image}`);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/userpostid`,{id:location.state.id});
            // console.log(response.data.post)
            setPosts(response.data.post);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const Profileupdate = (data) => {
        if(data === userData.id)
            navigate('/profileupdate')
    }
    // console.log(Array.isArray(userData.following))
    // console.log(userData.following)

    const getFollowcolor = (userData, location) => {
        if (Array.isArray(userData.follower)) {
          const followerData = userData.follower.find(data => data.receiver_id === location.state.id);
      
          if (followerData) {
            return followerData.status === "accepted" ? "danger" : "secondary";
          }
        }
      
        return "primary";
      };

    const getFollowStatus = (userData, location) => {
        if (Array.isArray(userData.follower)) {
          const followerData = userData.follower.find(data => data.receiver_id === location.state.id);
            if(userData.id === location.state.id)
            {
                console.log("himseft")
                return "himself"
            }

            if (followerData) {
            return followerData.status === "accepted" ? "Unfollow" : "Requested";
            }
        }
      
        return "Follow";
      };

      const Handleclick = (id, status) => {
        // console.log(id)
        // console.log(status)
        if (status == "Unfollow") {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/unfollow`, { id: id })
                .then((response) => {
                    // console.log(response)
                    // console.log("unfollow")
                    fetchUserData();
                })
                .catch()
        }
        else if (status === 'requested') {

        }
        else {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/request`, { id: id })
                .then((response) => {
                    // console.log(response)
                    // console.log("hello")
                    fetchUserData();
                })
                .catch()
        }
        // console.log(status)
        // console.log(status[0])
    }

    const Handledelte=(e)=>{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/delete`,{id:e})
            .then((response) => {
                console.log(response.data.message)
                fetchUserPosts()
            })
            .catch()
    }

    const followingcount=()=>{
        return FrUser.follower?FrUser.follower.filter(data=>data.status === "accepted").length:0
    }

    const followercount=()=>{
        return FrUser.following?FrUser.following.filter(data=>data.status === "accepted").length:0
    }
      
    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-image">
                    <img
                        src={checkimage ? image : profileImage}
                        alt={profileImage}
                        className="rounded-circle"
                        onClick={()=>Profileupdate(FrUser.id)}
                        width={"120px"}
                        height={"120px"}
                    />
                </div>
                <div className="profile-info">
                    <h2>{FrUser.fullname}</h2>
                    <div className="profile-stats">
                        <span>{posts?.length || 0} Posts</span>
                        <span>{followingcount() || 0} Following</span>
                        <span>{followercount() || 0} Follower</span>
                    </div>
                </div>
            </div>

            <div className="profile-posts">
              
                {getFollowStatus(userData, location) === "himself"?
                <p style={{marginBottom:"90px"}}></p>:
                <button type="button" style={{ width: " 100%",marginBottom:'20px' }} class={`btn btn-${getFollowcolor(userData, location)}`}
                onClick={() => Handleclick(location.state.id,getFollowStatus(userData, location))}>{getFollowStatus(userData, location)}</button>
                }
              
                <h3>Posts</h3>
                <div className="posts-grid">
                    {getFollowStatus(userData, location) === "Unfollow" || getFollowStatus(userData, location) === "himself"?
                        Array.isArray(posts) && posts && posts.map((item, index) => {
                                            return (
                                                <div className="card col-4 mx-3 mb-3 mt-3" style={{"width":"300px","height":"350px"}} key={index}>
                                                <img className="card-img-top" src={`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/postimage/${item.id}`} alt="Card" height={"200px"}/>
                                                <div className="card-body">
                                                  <h4 className="card-title">{item.title}</h4>
                                                  <p className="card-text">{item.description}</p>
                                                  {getFollowStatus(userData, location) === "himself"?
                                                  <button className="btn btn-secondary" onClick={()=>Handledelte(item.id)} >delete</button>:""}
                                                </div>
                                              </div>
                                            )
                                        }) :""}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;

