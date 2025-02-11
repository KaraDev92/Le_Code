//pour répondre aux requêtes HTTP de données dans la BDD

import { Profil, Post } from "../mongoDB/lesShemas.js";
import mongoose from "mongoose";

export const dataForProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId)
        .select("pseudo pantheon type_deite amis mur date_derniere_connexion presentation -_id")
        .populate([
            {path: "amis", select:"pseudo -_id"}, 
            {path: "mur",select: "date titre contenu -_id"}])
        .exec();
        
        res.send(user);

    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(500).send();
    }
};

export const newPost = async (req, res) => {
    const userId = req.userId;
    const date = new Date();
    try {
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            titre: req.body.titre,
            contenu: req.body.contenu,
            date: date,
            auteur: userId
          });
        
        await post.save();
          
        const user = await Profil.findById(userId);
        user.mur.push(post);
        await user.save();
    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(500).send();
    }
}

