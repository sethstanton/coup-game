import React, { JSX } from 'react';
import { CardInformation } from '../types/types';

export const Card = ({cardInformation}: {cardInformation: CardInformation}): JSX.Element => {

    return (
        <div className='card'>
            <h3>{cardInformation.name}</h3>
            {cardInformation.image && cardInformation.image}
            <p>{cardInformation.action}</p>
        </div>
    );
}