import mongoose from "mongoose";
import { Post, Profil } from "../mongoDB/lesShemas.js";

export const deletePost = async (req, res) => {
    const ladate = req.body.date;
    const userId = req.userId;

    try {
        const user = await Profil.findById(userId)
            .select("mur")
            .lean()
            .exec();
        
        const lepost = await Post.findOne({date : ladate});
        const newListPosts = user.mur.filter((post) => String(post._id) !== String(lepost._id));

        const cursorUser = await Profil.findById(userId);
        cursorUser.mur = newListPosts;
        await cursorUser.save();

        await lepost.deleteOne();

        res.status(200).send();

    } catch (error) {
        console.log("Erreur dans la suppression du post : ", error);
        res.status(502).send();
    }
};

//pour enregistrer un nouveau post
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
        res.status(201).send();
    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(502).send();
    }
};