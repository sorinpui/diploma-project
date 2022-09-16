import { useState } from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";

// styles
import "./UpdateUserForm.css";

export default function UpdateUserForm({setUserData}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const {updateUser, isPending, error, errorFields} = useUpdateUser(setUserData);

  console.log(isPending);

  const handleUpdates = async (e) => {
    e.preventDefault();

    const dataToUpdate = {firstName, lastName, age, currPass, newPass};
    
    // filter out the fields that are empty, meaning they are not wanted to be updated
    Object.keys(dataToUpdate).forEach(field => {
      if (dataToUpdate[field] === "") {
        delete dataToUpdate[field];
      }
    });
    
    await updateUser(dataToUpdate);

    console.log(dataToUpdate);
  };

  return (
    <form className="update-user-form" onSubmit={handleUpdates}>
      <input
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        id="first-name"
        placeholder="First name"
        style={error && errorFields.includes("firstName") ? {border: "1px solid red"} : {}}
      />
      <input
        type="text"
        id="last-name"
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last name"
        style={error && errorFields.includes("lastName") ? {border: "1px solid red"} : {}}
      />
      <input
        type="number"
        id="age"
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        style={error && errorFields.includes("age") ? {border: "1px solid red"} : {}}  
      />
      <input
        type="password"
        id="current-password"
        onChange={(e) => setCurrPass(e.target.value)}
        placeholder="Current password"
        style={error && errorFields.includes("currPass") ? {border: "1px solid red"} : {}}
      />
      <input
        type="password"
        id="new-password"
        onChange={(e) => setNewPass(e.target.value)}
        placeholder="New password"
        style={error && errorFields.includes("newPass") ? {border: "1px solid red"} : {}}
      />
      <button disabled={isPending}>save changes</button>
    </form>
  )
}