import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProfileImage  from '../../Assets/profile.jpg'

const Followings = ({fwgcount}) => {

    // const [image, setimage] = useState(null)
    const navigate = useNavigate()
    const [User, setUser] = useState('')
    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        fetchdata()
    }, [])


    const fetchdata = () =>{
        console.log("inside")
        axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`
        )
            .then((response) => {
                console.log(response.data.user.follower)
                // setimage(response.data.user.following.)
                setUser(response.data.user.follower)
                fwgcount(response.data.user.follower)
                console.log(User)
                navigate('/following')
            })
            .catch()
    }

    const Handlerejected=(e)=>{
        // console.log("jjj")
        axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/unfollow`,{id:e}
        )
            .then((response) => {
                console.log(response)
                fetchdata()
                navigate('/following')
            })
            .catch()
    }

    const Hnadleuser = (e)=>{
        console.log(e)
        navigate('/userprofile',{state:{id:e}})
    }

    return (
        <div className='container'>
            <div className="col-sm-12" align="center">

                <div className="card-body">
                    <h5 className="card-title">Following List</h5>
                </div>

            </div>
            <div className="row">
                {User.length ?
                User.length && User.map((item, index) => {
                    return (
                        <div className="col-sm-12 mt-2" key={index}>
                            <div className="card">
                                <div className="card-body row">
                                    <div className="col-2">
                                        <img className='rounded-circle' src={item.receiver_user.image?`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${item.receiver_user.image}`:ProfileImage} alt="not found" width={'100px'} height={'100px'} />
                                    </div>
                                    <div className="col-8">
                                        <p className="card-text mt-5"onClick={()=>Hnadleuser(item.receiver_user.id)} >{item.receiver_user.fullname}</p>
                                    </div>
                                    <div className="col-2">
                                        <button className={`btn btn-${item.status==="accepted"?"danger":"primary"} float-end mt-4`} onClick={()=>Handlerejected(item.receiver_user.id)}>{item.status==="accepted"?"unfollow":"follow"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }):<p className="card-title" align="center">No user found</p>}
            </div>
        </div>
    )
}

export default Followings
