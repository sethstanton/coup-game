import React from "react";

interface PlayerListProps {
    players: string[];

}

const PlayerList: React.FC<PlayerListProps> =({players}) =>{
    return (
        <div>
            <h2>Player List</h2>
            <ul>
                {players.map((player, index) =>(
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;