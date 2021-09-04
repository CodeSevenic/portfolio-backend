require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const contactRoute = require('./route/contactRoute');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', contactRoute);

const port = process.env.PORT || 5000;
// Just saying
app.listen(port, console.log(`server listening on port ${port}`));