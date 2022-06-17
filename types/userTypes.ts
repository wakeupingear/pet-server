export type User = {
    creatures: {
        [key: string]: Creature;
    };
    currentCreature: string;
    email: string;
    sessionToken?: string;
    passwordHash: string;
    settings: {
        [key: string]: any;
    };
};

export type Creature = {
    name: string;
    health: number;
    styles: {
        color: string;
    };
};
