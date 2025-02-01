"use strict"

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = process.env.PORT || '3000';

//const users = [];

app.use(bodyParser.json());
//app.use(express.static(process.cwd()+"/leFront/divineClub/dist")); //A compléter
// app.get('/api/users', (req, res) => {
//     res.json(users);
// });
  
// app.post('/api/user', (req, res) => {
//     const user = req.body.user;
//     users.push(user);
//     res.json("user added");
// });
  
app.get('/', (req,res) => {
    res.send('App Works !');
    //res.sendFile(process.cwd()+"/leFront/divineClub/index.html")
});
  
app.listen(port, () => {
      console.log(`Serveur démarré sur le port : ${port}`);
});