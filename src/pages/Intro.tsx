import React, { Dispatch, SetStateAction } from 'react';
import PlayerList from '../components/PlayerList';
import { useNavigate } from 'react-router-dom';

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
    
    const handleAddPlayer= (e: React.FormEvent) => {
        e.preventDefault();

        if (allUsernames.includes(username)){
            alert("This username has been taken, please choose a different name");
            return;
        }

        if (username.trim()){
            setAllUsernames([...allUsernames, username]);
            // setUsername("");
        }
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

            <PlayerList players={allUsernames}/>
            
            <button onClick={handleStartGame} 
            disabled = {allUsernames.length < 2|| allUsernames.length > 6}
            >Start Game</button>
        </div>
    );
};

export default Intro;


