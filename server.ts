import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
require('dotenv').config();

import { getUser, login, logout } from './src/users';
import { User } from './types/userTypes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    await login(email, password, res);
});

app.delete('/logout', (req, res) => {
    const session = req.headers.authorization || '';
    logout(session, res);
});

app.use('*', (req, res, next) => {
    const session = req.headers.authorization || '';
    const user = getUser(session);
    if (!user) return res.status(201).send({ error: 'Not logged in' });
    res.locals.user = user;
    next();
});

app.use('/progress*', (req, res, next) => {
    const user: User = res.locals.user;
    next();
});

app.get('/progress*', (req, res) => {
    const { host, pathname } = req.query;
    res.send({
        progress: 'intro',
    });
});

app.post('/progress', (req, res) => {
    console.log(req.body);
    res.send({
        progress: '100',
    });
});

app.post('/settings', (req, res) => {
    const { settings } = req.body;
    return res.status(200).send({});
});

app.use('*', (req, res) => {
    res.status(404).send('Not found');
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
