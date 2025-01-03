import React, { useState } from 'react';

const UserNameInput = () => {
    const [username, setUsername] = useState("");
    
    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        console.log("Username Submitted", username);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Your User Name:
                <input 
                type = "text" 
                value ={username} 
                onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserNameInput;
