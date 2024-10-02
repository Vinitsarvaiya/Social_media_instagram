import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProfileImage  from '../../Assets/profile.jpg'

const LiveSearch = () => {
    const navigate = useNavigate()

    // const [image, setimage] = useState(null)
    const [User, setUser] = useState('')
    const [userid,setuserid] = useState('')
    const [search, setSearch] = useState()
    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        console.log("inside")
        fetchdata("")

    }, [])


    useEffect(() => {
        fetchdata(search)
    }, [search])

    const fetchdata = (search) => {

        console.log(search)
        axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/search`, { search: search ? search : "" }
        )
            .then((response) => {
                setUser(response.data.user)
                setuserid(response.data.id)
                console.log(response.data.user)
            })
            .catch()
    }

    const Handleclick = (id, status) => {
        console.log(id)
        console.log(status)
        if (status[0] === 'rejected') {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/unfollow`, { id: id })
                .then((response) => {
                    console.log(response)
                    console.log("unfollow")
                    fetchdata()
                })
                .catch()
        }
        else if (status[0] === 'requested') {
            // axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/unfollow`, { id: id })
            //     .then((response) => {
            //         console.log(response)
            //         console.log("unfollow")
            //         fetchdata()
            //     })
            //     .catch()
        }
        else {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/people/request`, { id: id })
                .then((response) => {
                    console.log(response)
                    console.log("hello")
                    fetchdata()
                })
                .catch()
        }
        console.log(status)
        console.log(status[0])
    }

    const Hnadleuser = (e)=>{
        console.log(e)
        navigate('/userprofile',{state:{id:e}})
    }

    return (
        <div className='container'>
            <input class="form-control mr-sm-2 mt-5 mb-5" type="search" placeholder="Search" name="search" value={search} aria-label="Search" onChange={(e) => setSearch(e.target.value)} />
            <div className='container'>
                <div className="col-sm-12" align="center">

                    <div className="card-body">
                        <h5 className="card-title">User List</h5>
                    </div>

                </div>
                <div className="row">
                    {User.length !== 0 ?
                        User.length && User.map((item, index) => {
                            return (
                                <div className="col-sm-12 mt-2" key={index}>
                                    <div className="card">
                                        <div className="card-body row">
                                            <div className="col-2">
                                                <img className='rounded-circle' src={item.image?`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${item.image}`:ProfileImage} alt="not found" width={'100px'} height={'100px'} />
                                            </div>
                                            <div className="col-7">
                                                <p onClick={()=>Hnadleuser(item.id)} className="card-text mt-5">{item.fullname}</p>
                                            </div>
                                            <div className="col-3">

                                                { userid === item.id ?"":
                                                <button style={{ width: " 50%" }}
                                                    className={`btn btn-${item.following.length !== 0 ? item.following.map(data => data.status === "accepted" ? "danger" : "secondary") : "primary"} float-end mt-4`}
                                                    onClick={() => Handleclick(item.id, item.following.length !== 0 ? item.following.map(data => data.status === "accepted" ? "rejected" : "requested") : "request")} >
                                                    {item.following.length !== 0 ? item.following.map(data => data.status === "accepted" ? "unfollow" : "requested") : "  follow  "}
                                                </button>}
                                                {/* <button className="btn btn-success float-end mt-4 mx-3" onClick={()=>Handlerequestaccept(item.id)} >Accepte </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : "No user found"}
                </div>
            </div>
        </div>
    )
}

export default LiveSearch
