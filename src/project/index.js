import Home from "./Home";
import LogIn from "./Users/LogIn";
import SignUp from "./Users/SignUp";
import Profile from "./Users/Profile";
import Details from "./Detail";
import Navigation from "./Navigation";
import { Route, Routes } from "react-router-dom";
import React from "react";
import Search from "./Search";
import { Provider } from "react-redux";
import CurrentUser from "./Users/currentUser";
import store from "./store";
import Account from "./Users/account";
import LikesList from "./Users/likes/likeList";
import UserList from "./Users/userList";
import GallaryList from "./Users/Gallary/gallaryList";
import Gallary from "./Users/Gallary/gallary";


function Project(){
  return(
    <Provider store={store}>
      <CurrentUser>
        <div className="container-fluid pb-5" style={{ backgroundColor: 'rgba(218, 176, 237, 0.15)', height: '100%'}}>
          <div className="row">
            <div className="pt-2 ps-4 pb-2 mb-4" style={{ backgroundColor: 'black', color: 'white', position: 'fixed', top: 0, left: 0, zIndex: 1, height: '75px', fontSize: '40px'}}>
              Own Gallary
            </div>
          </div>
          <div className="row" style={{ marginTop: '100px' }}>
            <div className="col-1" style={{ minWidth: '100px'}}>
            <Navigation />
            </div>
            <div className="col me-5" style={{ minHeight: '100vh'}}>
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/login" element={<LogIn />}/>
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/search/" element={<Search />}/>
                <Route path="/search/:search" element={<Search />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/profile/:id" element={<Profile />}/>
                <Route path="/details/:artworkID" element={<Details />}/>
                <Route path="/account" element={<Account />} />
                <Route path="/likes" element={<LikesList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/gallary" element={<GallaryList />} />
                <Route path="/:userID/gallary" element={<GallaryList />} />
                <Route path="/:userID/gallary/:gallaryID" element={<Gallary />} />
                <Route path="/gallary/:gallaryID" element={<Gallary />} />
              </Routes>
            </div>
          </div>
        </div>
      </CurrentUser>
    </Provider>
  );
}export default Project;