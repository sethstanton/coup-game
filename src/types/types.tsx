export enum Roles {
    DUKE = 'Duke',
    CAPTAIN = 'Captain',
    AMBASSADOR = 'Ambassador',
    ASSASSIN = 'Assassin',
    CONTESSA = 'Contessa',
}

export type CardInformation = {
    name: Roles,
    image?: string,
    action: string,
}

export type CharacterInformation = {
    username: string,
    cards: CardInformation[],
    coins: number,
    influence: number,
}