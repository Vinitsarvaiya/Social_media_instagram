import React, { useState, useEffect } from 'react'
import Profiledetail from './Profiledetail'
import ProfilePost from './ProfilePost'
import axios from 'axios'

const Profile = ({postcount,pfollowing,pfollower}) => {
    
    // useEffect(() => {
    //     fetchdata()
    // },[])

    // const fetchdata = async () => {
    //     axios.get(
    //         `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`
    //     )
    //         .then((response) => {
    //             console.log(response.data.user)
    //         })
    //         .catch()
    // }


    return (
        <div>
                {/* <Profiledetail postdata={data} /> */}
                <ProfilePost postcount={postcount}/>
        </div>
    )
}

export default Profile
