import { Routes, Route, useLocation , Navigate } from 'react-router-dom';
import './App.css';
import Register from './component/Authantication/Register/Register';
import OtpVerify from './component/Authantication/Otp/OtpVerify';
import Login from './component/Authantication/Login/Login';
import Profile from './component/InstastarComponent/UserProfile/Profile';
import ProfileUpdate from './component/InstastarComponent/UserProfile/ProfileUpdate';
import Following from './component/InstastarComponent/ListofPeople/Following';
import Followings from './component/InstastarComponent/ListofPeople/Followings';
import ReuestList from './component/InstastarComponent/ListofPeople/ReuestList';
import CreatePosts from './component/InstastarComponent/Posts/CreatePosts';
import Navbar from './component/Nvabar/Navbar';
import { useEffect, useState } from 'react';
import LiveSearch from './component/InstastarComponent/LiveSearch/LiveSearch';
import ProfilePage from './component/InstastarComponent/UserProfile/ProfilePage';
import UserProfilePage from './component/InstastarComponent/AllUserPofile.js/UserProfileSearch';
import Home from './component/InstastarComponent/Home/Home';
import PrivateRoutes from './PrivateRoute';

function App() {
  const location = useLocation();
  const [data, setData] = useState();
  const [navData, setNavData] = useState(null);
  const [isAuthPage, setIsAuthPage] = useState(true);
  const [counts, setCounts] = useState({ postCount: 0, followingCount: 0, followerCount: 0 });
  const [requestIds, setRequestIds] = useState([]);

  useEffect(() => {
    const authPaths = ['/home', '/profilepage', '/userprofile','/profile','/profileupdate','/follower','/following','/requestlist','/createpost','/search'];
    setIsAuthPage(authPaths.includes(location.pathname));
  }, [location]);

  return (
    <div className="App">
      {isAuthPage && <Navbar navupdate={navData} counts={counts} requestIds={requestIds} />}
      <div style={{ marginLeft: `${!isAuthPage ? "0" : "15%"}`, padding: "1px 16px", height: "100%" }}>
        <Routes>
          <Route index path="/register" element={<Register />} />
          <Route path="/verify" element={<OtpVerify />} />
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route path="/profile" element={<Profile postcount={setCounts} />} />
            <Route path="/profileupdate" element={<ProfileUpdate update={setNavData} />} />
            <Route path="/follower" element={<Following fwrcount={setCounts} />} />
            <Route path="/following" element={<Followings fwgcount={setCounts} />} />
            <Route path="/requestlist" element={<ReuestList dataid={setRequestIds} />} />
            <Route path="/createpost" element={<CreatePosts />} />
            <Route path="/search" element={<LiveSearch />} />
          </Route>
          <Route path="/*" element={<Navigate to="/" />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
