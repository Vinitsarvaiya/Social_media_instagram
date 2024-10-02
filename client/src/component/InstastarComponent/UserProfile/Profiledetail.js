import React, { useEffect, useState } from 'react'
import profileImage from '../../Assets/profile.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profiledetail = ({ postdata }) => {

    const navigate = useNavigate()

    const style = {
        "border": "1px solid black",
    }
    const [image, setimage] = useState(null)
    const [User, setUser] = useState('')
    const [Following, setFollowing] = useState([])
    const [Follower, setFollower] = useState([])
    const [Post, setPost] = useState([])

    useEffect(() => {
        fetchdata()
    }, [], [navigate])

    const fetchdata = async () => {
        axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/list`
        )
            .then((response) => {
                console.log(response.data.user)
                setFollowing(response.data.user.following)
                setPost(response.data.user.posts)
                setFollower(response.data.user.follower)
                setimage(`${process.env.REACT_APP_BACKEND_URL}/api/instastar/user/profileimage/${response.data.user.id}`)
                setUser(response.data.user)
                console.log(User)
            })
            .catch()
    }

    const Posts = () => {

        console.log(postdata)
        const list = Post.filter(data => data).length
        return list
    }

    const Followinglist = () => {
        const list = Following.filter(data => data.status === "accepted").length
        return list
    }

    const Followerlist = () => {
        const list = Follower.filter(data => data).length
        return list
    }

    const Profileupdate = () => {
        navigate('/profileupdate')
    }

    const Handlefollower = () => {
        navigate('/follower')
    }

    const HandleFollowing = () => {
        navigate('/following')
    }

    const HnadlePost = () => {
        navigate('/createpost')
    }

    const HnadleRequest = () => {
        navigate('/requestlist')
    }

    return (
        <div>
            <div className="mb-3" style={{backgroundColor:"#f1f1f1"}}>
                <div className="row" style={{backgroundColor:"#f1f1f1"}}>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginTop: "30px" }}>{Posts() ? Posts() : 0} </h2>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginTop: "30px" }} onClick={Handlefollower}> {Followinglist() ? Followinglist() : 0}</h2>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginTop: "30px" }} onClick={HandleFollowing}>{Followerlist() ? Followerlist() : 0}</h2>
                </div>
                <div className="row" style={{backgroundColor:"#f1f1f1"}}>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginBottom: "30px" }} > <small>posts</small></h2>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginBottom: "30px" }} onClick={Handlefollower}> <small>followers</small></h2>
                    <h2 className="col-4 d-flex 
                        align-items-center 
                        justify-content-center" style={{ marginBottom: "30px" }} onClick={HandleFollowing}><small>following </small></h2>
                </div>

            </div>

        </div>
    )
}

export default Profiledetail
