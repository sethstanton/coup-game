import React, { useState } from 'react';

const UserNameInput = ({onUsernameSubmit }: {onUsernameSubmit: (username: string) => void}) => {
    const [username, setUsername] = useState("");
    
    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        onUsernameSubmit(username);
        console.log("Username Submitted", username);
        setUsername("");
        
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
