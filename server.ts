import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import {
    getUser,
    login,
    logout,
    resetUsers,
    signup,
    signupCode,
    updateUser,
} from './src/users';
import { Creature, User } from './types/userTypes';
import uuid4 from 'uuid4';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    login(email, password, res);
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    signup(email, password, res);
});

app.post('/signup/code', (req, res) => {
    const { email, code } = req.body;
    signupCode(email, code, res);
});

app.delete('/logout', (req, res) => {
    const session = req.headers.authorization || '';
    logout(session, res);
});

app.get('/admin/reset', async (req, res) => {
    const password = req.headers.authorization;
    if (password !== 'foojardigibutterjoe') {
        return res.status(401).send();
    }

    await resetUsers();
    res.send({
        result: 'It is done',
    });
});

app.use('*', (req, res, next) => {
    const session = req.headers.authorization || '';
    const user = getUser(session);
    if (!user) return res.status(201).send({ error: 'Not logged in' });
    res.locals.user = user;
    next();
});

app.get('/progress*', (req, res) => {
    const user: User = res.locals.user;
    const { host, pathname, needSettings } = req.query;
    const result = {
        progress: 'intro',
        settings: {},
        creature: user.currentCreature && user.creatures[user.currentCreature],
    };
    if (user) {
        if (needSettings === 'true') result.settings = user.settings;
    }
    res.send(result);
});

app.post('/progress', (req, res) => {
    res.send({
        progress: '100',
    });
});

app.post('/creature', (req, res) => {
    const user: User = res.locals.user;
    const creature: Creature | null = req.body.creature;
    if (!creature) {
        if (req.body.isDev) delete user.creatures[user.currentCreature];
        user.currentCreature = '';
    } else {
        user.currentCreature = uuid4();
        if (user.creatures === undefined) user.creatures = {};
        user.creatures[user.currentCreature] = creature;
    }
    updateUser(user);

    res.send({
        result: 'ok',
    });
});

app.post('/settings', (req, res) => {
    const user: User = res.locals.user;
    const { settings } = req.body;
    user.settings = settings;
    updateUser(user);
    return res.status(200).send({
        result: 'ok',
    });
});

app.use('*', (req, res) => {
    res.status(404).send('Not found');
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
