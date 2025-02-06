// import mongoose from "mongoose";
// import 'dotenv/config';
// import { Profil, NewMember, Login } from './lesShemas';
// import express from "express";

// const uri = process.env.MONGODB_CONNECTION_STRING;
// const router = express.Router();

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// mongoose.connection.on("open", function() {
//     console.log('Connection à MongoDB réussie');
// });
// mongoose.connection.on("error", function() {
//     console.error('Connexion à MongoDB a rencontré une erreur :', error);
// });

// console.log("Connection à MongoDB en cours ...");

// // router.get('/', async (req, res) => { 
// //     try {
// //       const tasks = await Task.find();
// //       res.json(tasks);
// //     } catch (error) {
// //       res.status(500).json({ message: error.message });
// //     }
// //  });

// router.post('/login', async (req, res) => {
//     const newLogin = new Login( {
//       adresse_mail: req.body.email,
//       mot_de_passe: req.body.password
//     })
//     try { //A revoir !!!
//       const login = await Login.find();// Find à préciser !
//       // insérer fonction du module d'authentification (à créer)!
//       // résultat doit être token à renvoyer
//       res.json(login); // résultat doit être token à renvoyer
//     } catch (error) {
//        res.status(500).json({ message: error.message });
//     }
// });

 
// // router.post('/', async (req, res) => {
// //     const task = new Task({
// //       title: req.body.title,
// //       description: req.body.description,
// //       completed: req.body.completed
// //     });
// //     try {
// //       const newTask = await task.save();
// //       res.status(201).json(newTask);
// //     } catch (error) {
// //       res.status(400).json({ message: error.message });
// //     }
// //   });
//   // Implement other CRUD operations (GET by ID, PUT, DELETE)
// router.post('/newuser', async (req, res) => {
//     const newMember = new NewMember({
//         pseudo: req.body.pseudo,
//         adresse_mail: req.body.email,
//         mot_de_passe: req.body.password,
//         nom: req.body.name,
//         pantheon: req.body.pantheon,
//         type_deite: req.body.divinity //,
//         //avatar: req.body.avatar
//     });
//     try {
//         const newTask = await newMember.save();
//         res.status(201).json(newTask);
//       } catch (error) {
//         res.status(400).json({ message: error.message });
//       }
// }); 

// export {router};


