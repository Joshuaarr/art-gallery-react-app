import * as client from "./client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try {
      const user = await client.account();
      setUser(user);
    } catch (error) {
      navigate("/project/login");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const updateUser = async () => {
    const status = await client.updateUser(user._id, user);
  };
  const signout = async () => {
    const status = await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/project/login");
  };
  const deleteUser = async (id) => {
    const status = await client.deleteUser(id);
    navigate("/project");
  };

  return (
    <div className="ms-4">
      <h1>Account</h1>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email:</p>
          <input
            type="email"
            className="form-control mb-3"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <p>First Name:</p>
          <input
            type="text"
            className="form-control mb-3"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
          <p>Last Name:</p>
          <input
            type="text"
            className="form-control mb-3"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />

          <p>Role:</p>
          <select
            className="form-control mt-1 w-100 mb-3"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="CREATER">Creater</option>
          </select>
          <button onClick={updateUser} className="btn btn-primary">
            Update
          </button>
          <button onClick={signout} className="btn btn-danger ms-3">
            Sign Out
          </button>
          <button
              onClick={() => deleteUser(user._id)}
              className="btn btn-danger ms-3"
            >
              Delete Account
            </button>
          {user.role === "ADMIN" && (
            <Link to="/project/users" className="btn btn-warning ms-3">
              Users
            </Link>
          )}
          <Link to={`/project/profile/${user._id}`} className="btn btn-warning ms-3">
            Nav to Profile
          </Link>
        </div>
      )}
    </div>
  );
}

export default Account;