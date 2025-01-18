import React, { useContext } from "react";
import { UserContext } from "../components/Layout";

function Accounts(props) {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        <li>{user.email || "No email yet"}</li>
        <li>{user.status}</li>
        <li>{user.uuid}</li>
      </ul>

      <ul>
        <li>Profile Section</li>
        <li>Password Reset</li>
      </ul>
    </div>
  );
}

export default Accounts;
