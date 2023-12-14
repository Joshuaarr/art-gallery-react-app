import * as client from "./client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./userList.css";
import {
  BsFillCheckCircleFill,
  BsTrash3Fill,
  BsPlusCircleFill,
  BsPencil,
} from "react-icons/bs";
function UserList() {
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  const resetForm = () => {
    setSelectedUser({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "USER",
    });
  };

  const [selectedUser, setSelectedUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });
  const createUser = async () => {
    try {
      const newUser = await client.createUser(selectedUser);
      setUsers([newUser, ...users]);
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const selectUser = async (user) => {
    try {
      const u = await client.findUserById(user._id);
      setSelectedUser(u);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async () => {
    try {
      const status = await client.updateUser(selectedUser._id, selectedUser);
      setUsers(users.map((u) => (u._id === selectedUser._id ? selectedUser : u)));
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteUser = async (user) => {
    try {
      await client.deleteUser(user._id);
      setUsers(users.filter((u) => u._id !== user._id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users, selectedUser]); 

  return (
    <div className="ms-5 mt-2">
      {currentUser && currentUser.role === "ADMIN" && (
        <>
          <h2>Manage Users</h2>
          <hr />
          













          <table className="table">
        <thead>
          <tr>
            <th>Username and Password</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Edit</th>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", flexFlow: "row nowrap" }}>
                <input
                  className="form-control"
                  placeholder="Username"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, username: e.target.value })
                  }
                />
                <input
                  value={selectedUser.password}
                  placeholder="Password"
                  className="form-control  ms-2"
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, password: e.target.value })
                  }
                />
              </div>
              </td>
            <td>
              <input
                className="form-control"
                placeholder="First Name"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, firstName: e.target.value })
                }
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="Last Name"
                value={selectedUser.lastName}
                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
              />
            </td>
            <td>
              <select
                className="form-control"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
              </select>
            </td>
            <td className="text-nowrap">
              <BsPlusCircleFill
                onClick={createUser}
                className="text-primary fs-1 text me-2"
              />
              <BsFillCheckCircleFill
                onClick={updateUser}
                className=" text-success fs-1 text"
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/project/account/${user._id}`}>{user.username}</Link>
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td></td>
              <td className="text-nowrap">
                <button className="btn btn-warning me-2">
                  <BsPencil onClick={() => selectUser(user)} />
                </button>
                <button className="btn btn-danger me-2">
                  <BsTrash3Fill onClick={() => deleteUser(user)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>








        </>
      )}
      {currentUser && currentUser.role !== "ADMIN" && (
        <Navigate to="/project/signin" />
      )}
    </div>
  );
}

export default UserList;