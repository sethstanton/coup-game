import React, { useEffect, useState } from 'react';
import { CharacterInformation } from '../types/types';
import { formatCharacterInformation } from '../utils/utils';
import { Card } from '../components/Card';

export const MainGame = ({username}:{username: string}) => {
const [character, setCharacter] = useState<CharacterInformation | null>(null)

    useEffect(() => {       
        setCharacter(formatCharacterInformation(username))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (!character) {
        return <div>Loading...</div>;
    }

    return (

    <div className="playerScreen">
        <h2>Welcome {character.username}!</h2>
        <p>Coins: {character.coins}</p>

        <div className='cardScreen'>
            <h2>Cards:</h2>
            {character.cards.map((card, idx) => <Card cardInformation={card}/>)}
        </div>
    </div>
    ) 
    
    
}