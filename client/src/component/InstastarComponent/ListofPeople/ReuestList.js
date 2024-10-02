import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProfileImage  from '../../Assets/profile.jpg'

const ReuestList = ({dataid}) => {
   const navigate = useNavigate()

    // const [image, setimage] = useState(null)
    const [User, setUser] = useState('')
    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        console.log("inside")
        fetchdata()

    }, [], [navigate])

    const fetchdata=()=>{
        axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`
        )
            .then((response) => {
                console.log(response)
                const data = response.data.user.following.filter(data=>data.status === "pending")
                console.log(data)
                dataid(response.data.user.following)
                setUser(data)
                // console.log(User)
            })
            .catch()
    }
    const Handlerequestreject=(id)=>{
        // setid(id)
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/rejected`,{id:id})
        .then((response)=>{
            console.log(response)
            console.log("hello")
            fetchdata()
        })
        .catch()
    }

    const Handlerequestaccept=(id)=>{
        // setid(id)
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/accepted`,{id:id})
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
                    <h5 className="card-title">Request List</h5>
                </div>

            </div>
            <div className="row">
                {User.length !== 0?        
                User.length && User.map((item, index) => {
                    return (
                        <div className="col-sm-12 mt-2" key={index}>
                            <div className="card">
                                <div className="card-body row">
                                    <div className="col-2">
                                        <img className='rounded-circle' src={item.sender_user.image?`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${item.sender_user.image}`:ProfileImage} alt="not found" width={'100px'} height={'100px'} />
                                    </div>
                                    <div className="col-7">
                                        <p className="card-text mt-5" onClick={()=>Hnadleuser(item.sender_user.id)}>{item.sender_user.fullname}</p>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-danger float-end mt-4" onClick={()=>Handlerequestreject(item.sender_user.id)} >rejected</button>
                                        <button className="btn btn-success float-end mt-4 mx-3" onClick={()=>Handlerequestaccept(item.sender_user.id)} >Accepte </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }): <p className="card-title" align="center">No user found</p>}
            </div>
        </div>
    )
}

export default ReuestList
