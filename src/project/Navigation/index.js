import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";
import * as client from "../Users/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

function Navigation() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try {
      const user = await client.account();
      if (typeof user === 'object') {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [location.pathname]);


  return (
    <div className="list-group">
      <NavLink to="/project/home" className="list-group-item" activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/project/search" className="list-group-item" activeClassName="active">
        Search
      </NavLink>
      <NavLink to="/project/details" className="list-group-item" activeClassName="active">
        Details
      </NavLink>
      {user === null ? (
        <NavLink to="/project/login" className="list-group-item" activeClassName="active">
          Log In
        </NavLink>
      ) : null}
     
      {user === null ? (
        <NavLink to="/project/signup" className="list-group-item" activeClassName="active">
          Sign Up
        </NavLink>
      ) : null}

      {user !== null && (
        <>
        <NavLink to="/project/account" className="list-group-item" activeClassName="active">
          Account
        </NavLink>
        <NavLink to={`/project/profile`} className="list-group-item" activeClassName="active">
          Profile
        </NavLink>
        <NavLink to={`/project/likes`} className="list-group-item" activeClassName="active">
          Likes
        </NavLink>
        <NavLink to={`/project/${user.username}/gallary`} className="list-group-item" activeClassName="active">
          Gallary
        </NavLink>
        </>
      )}
       {user && user.role === "ADMIN" && (<NavLink to={`/project/users`} className="list-group-item" activeClassName="active">
          Users list
        </NavLink>)}
    </div>
  );
}

export default Navigation;