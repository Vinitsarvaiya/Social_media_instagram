import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProfileImage from '../../Assets/profile.jpg'
import arrayShuffle from 'array-shuffle';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const token = sessionStorage.getItem("key");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const getpostdata = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/Followingpost`)
        console.log(response.data.posts)
        let post;
        if(response.data.posts){
            post = response.data.posts.filter(data => data.user !== null)
            const result = Object.values(post);
            console.log(result[0])
            const shuffled = arrayShuffle(post);
            console.log(shuffle)
            console.log(shuffled)
            console.log(post)
            setPosts(shuffled)
        }
        else
        {
            post=[];
            console.log(post)
        }
    }

    const shuffle = (array) => {
        let temp
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return temp
    }

    useEffect(() => {
        getpostdata()
    }, [])

    const Hnadleuser = (e) => {
        console.log(e)
        navigate('/userprofile', { state: { id: e } })
    }
    return (
        <div className='container'>
            <div className="row">
                {Array.isArray(posts) && posts && posts.map((item, index) => {
                    return (
                        <div className="col-4">
                            <div className="card mx-3 mb-3 mt-3" style={{ "width": "100%", "height": "450px" }} key={index}>
                                <div class="card-header " style={{ display: 'flex' }}>
                                    <img className='rounded-circle '
                                        src={item.user.image ? `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${item.user.image}` : ProfileImage}
                                        alt="not found"
                                        width={'30px'} height={'40px'}
                                        onClick={() => Hnadleuser(item.user.id)} />
                                    <p className='float-start' align="center" style={{ marginLeft: '25px' }} onClick={() => Hnadleuser(item.user.id)}>{item.user.fullname}</p>
                                </div>
                                <img className="card-img-top" src={`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/postimage/${item.id}`} alt="Card" height={"250px"} />
                                <div className="card-body">
                                    <h4 className="card-title">{item.title}</h4>
                                    <p className="card-text">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Home
