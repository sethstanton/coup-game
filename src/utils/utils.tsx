import { CardInformation, CharacterInformation, Roles } from "../types/types";

export const generateCards = (): CardInformation[] => {
    const roleValues = [...Object.values(Roles)];

    for (let i = roleValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roleValues[i], roleValues[j]] = [roleValues[j], roleValues[i]];
    }
    const selectedCards = roleValues.slice(0,2);

    return selectedCards.map((role) => {
        switch (role) {
            case Roles.DUKE:
              return { name: role, action: 'Tax: Take 3 coins from the treasury.' };
            case Roles.CAPTAIN:
              return { name: role, action: 'Steal: Take 2 coins from another player.' };
            case Roles.AMBASSADOR:
              return { name: role, action: 'Exchange: Swap cards with the court deck.' };
            case Roles.ASSASSIN:
              return { name: role, action: 'Assassinate: Pay 3 coins to eliminate a player.' };
            case Roles.CONTESSA:
              return { name: role, action: 'Block: Prevent an assassination attempt.' };
            default:
              throw new Error('Unknown role');
        }
    })
}

export const formatCharacterInformation = (username: string): CharacterInformation => {
    console.log('username', username);
    const cards: CardInformation[] = generateCards();

    const initalizeCharacter: CharacterInformation = {
        username,
        cards,
        coins: 2,
        influence: 2,
    }

    return initalizeCharacter;
}