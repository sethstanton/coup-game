import React from 'react';
import UserNameInput from '../components/UserNameInput';

/** This is going to be the login/intro page. 
 * - as a user, I want to be able to provide the user with a url
 * - so that they can enter their username
 * - and be entered as a player
 * - and are navigated to the main page to play the game
*/
const Intro = () => {
    return (
        // need username form with submit button
        <UserNameInput onUsernameSubmit={}/>

    );
};

export default Intro;


