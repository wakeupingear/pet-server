import { Response } from 'express';
import fs from 'fs';
import uuid4 from 'uuid4';
import bcrypt from 'bcrypt';

import { User } from '../types/userTypes';

interface UserMap {
    [key:string]: User;
}

if (!fs.existsSync('./saveData')) fs.mkdirSync('./saveData');
const saveJSON = (data: object, fileName: string) => {
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
};
const loadJSON = (fileName: string, defaultData = {}) => {
    if (!fs.existsSync(fileName)) {
        saveJSON(defaultData, fileName);
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(fileName).toString()) || {};
};

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const users: UserMap = loadJSON('./saveData/users.json');
const userSessions: {[key: string]: string} = {};

export const getUser = (session: string): User | null => {
    const email = userSessions[session];
    if (!email || !(email in users)) return null;
    return users[email];
}

export const login = async (email: string, password: string, res: Response) => {
    const hash = await hashPassword(password);
    const user = getUser(email);
    if (!user) return res.status(404).send({
        error: "No user found"
    });
    if (user.passwordHash!==hash) return res.status(401).send({
        error: "Incorrect password"
    });

    const newSession = uuid4();
    userSessions[email] = newSession;
    user.session = newSession;

    return res.send({
        session: newSession
    });
}

export const logout = (session: string, res: Response) => {
    if (!(session in userSessions)) return res.status(401).send({
        error: "Invalid session"
    });

    delete userSessions[session];

    return res.send({
        result: "ok"
    })
}
