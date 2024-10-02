import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ProfilePost = ({postcount}) => {

    let token = sessionStorage.getItem("key")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const [posts,setposts]=useState([])



    useEffect(() => {
       fetchdata()
    },[])

    const fetchdata = () =>{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/userpost`)
        .then((response) => {
            console.log(response)
            setposts(response.data.post)
            postcount(response.data.post)
        })
        .catch()
    }

    const Handledelte=(e)=>{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/delete`,{id:e})
            .then((response) => {
                console.log(response.data.message)
                fetchdata()
            })
            .catch()
    }
    return (
        <div className='container' style={{marginTop:"50px"}}>
              <div className="row">
        {posts && posts.map((item, index) => {
                                            return (
                                                <div className="card col-4 mx-3 mb-3 mt-3" style={{"width":"400px","height":"400px"}} key={index}>
                                                <img className="card-img-top" src={`${process.env.REACT_APP_BACKEND_URL}/api/instastar/post/postimage/${item.id}`} alt="Card" height={"250px"}/>
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
    )
}

export default ProfilePost
