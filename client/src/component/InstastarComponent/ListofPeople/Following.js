import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProfileImage  from '../../Assets/profile.jpg'

const Following = ({fwrcount}) => {
    const navigate = useNavigate()

    // const [image, setimage] = useState(null)
    const [User, setUser] = useState('')
    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        fetchdata()
    }, [], [navigate])

    const fetchdata=()=>{
        console.log("inside")
        axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`
        )
            .then((response) => {
                console.log(response.data.user.following)
                const data = response.data.user.following.filter(data=>data.status === "accepted")
                console.log(data)

                setUser(data)
                fwrcount(data)
            })
            .catch()

    }

    const Handlerequest=(id)=>{
        axios.post("${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/request",{id:id})
        .then((response)=>{
            console.log(response)
            console.log("hello")
            fetchdata()
        })
        .catch()
    }

    const Handlerequestreject=(id)=>{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/rejected`,{id:id})
        .then((response)=>{
            console.log(response)
            console.log("hello")
            fetchdata()
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
                    <h5 className="card-title">Follower List</h5>
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
                                        <img className='rounded-circle' src={item.sender_user.image?`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${item.sender_user.image}`:ProfileImage} alt="not found" width={'100px'} height={'100px'} />
                                    </div>
                                    <div className="col-7">
                                        <p className="card-text mt-5" onClick={()=>Hnadleuser(item.sender_user.id)} >{item.sender_user.fullname}</p>
                                    </div>
                                    <div className="col-3">
                                        
                                        <button className="btn btn-danger float-end mt-4 mx-3" onClick={()=>Handlerequestreject(item.sender_user.id)} >Remove</button>
                                       
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

export default Following
