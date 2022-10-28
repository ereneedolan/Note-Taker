const express = require('express');
const path = require('path');
// const fs = require('fs');
// const util = require('util');
const { v4: uuidv4 } = require('uuid');
const {readFromFile, writeToFile, readAndAppend} = require('./utils/fs-helpers')

const PORT = process.env.PORT||3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>{
    //for API get routes want to grab the data from the database, send it to the frontend with res JSON
    console.info(`${req.method} request received for tips`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

app.post('/api/notes', (req, res) =>{
    console.info(`${req.method} request received to add a tip`);

  const { title, text } = req.body; //sending data with request

  if (req.body) {
    const newNote = {
        title: title,
        text: text,
        id: uuidv4()
    };

    readAndAppend(newNote, './db/db.json');
    res.json(``);
  } else {
    res.error('');
  }
  });


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

