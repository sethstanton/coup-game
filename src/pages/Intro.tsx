import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import PlayerList from '../components/PlayerList';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket,sendWebSocketMessage,listenWebSocket } from '../utils/websocket';

/** This is going to be the login/intro page. 
 * - as a user, I want to be able to provide the user with a url
 * - so that they can enter their username
 * - and be entered as a player
 * - and are navigated to the main page to play the game
*/
interface IntroProps {
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    allUsernames: string[];
    setAllUsernames: Dispatch<SetStateAction<string[]>>;
}

const Intro: React.FC<IntroProps> = (
    {username, setUsername, allUsernames, setAllUsernames }) => {
    
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(()=> {
        const socket = connectWebSocket('ws://localhost:3001');

        listenWebSocket((message)=> {
            switch (message.type){
                case 'updatePlayers':
                    setAllUsernames(message.players);
                    console.log('Updated Player List:', message.players);
                    break;
                case 'error':
                    setErrorMessage(message.message);
                    break;
                default:
                    console.log('unknown error type:', message);
            }
        });

        return() =>{
            // if(socket) socket.close();
        };
    },[setAllUsernames]);
    
    const handleAddPlayer= (e: React.FormEvent) => {
        e.preventDefault();
        sendWebSocketMessage({type: 'submitUsername', username});
        console.log("Username Submitted", username);
        
    };

    const handleStartGame = () => {
        if (allUsernames.length < 2){
            alert("At least 2 players are required to start the game.");
            return;
        }
        if (allUsernames.length > 6) {
            alert("The maximum amount of players is 6.");
            return;
        }
        navigate('/game');
    }

    return (
        <div>
            <h1>You are on the Coup lobby page</h1>
            <form onSubmit={handleAddPlayer}>
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

            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

            <PlayerList players={allUsernames}/>
            
            <button 
            onClick={handleStartGame} 
            disabled = {allUsernames.length < 2|| allUsernames.length > 6}
            >Start Game</button>
        </div>
    );
};

export default Intro;


