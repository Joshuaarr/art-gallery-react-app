import * as client from "../client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logIn = async () => {
    try {
      const credentials = { username: username, password: password };
      const user = await client.login(credentials);
      dispatch(setCurrentUser(user));
      navigate("/project/account");
      window.location.reload(true);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <div>
      <h2>Log In</h2>
      {error && <div className="alert alert-danger">{error.message}</div>}
      <input
        type="text"
        className="form-control"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={logIn} className="btn btn-primary">
        Log In
      </button>
    </div>
  );
}

export default LogIn;