//pour répondre aux requêtes HTTP de données dans la BDD

import { Profil, Friend } from "../mongoDB/lesShemas.js";
import mongoose from "mongoose";
import { warnExFriend } from "../middlewares/messenger.js";

//pour récupérer les données de son profil
export const dataForProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId)
        .select("pseudo pantheon type_deite amis mur date_derniere_connexion presentation -_id")
        .populate([
            {path: "amis", select:"pseudo -_id"}, 
            {path: "mur",select: "date titre contenu -_id"}])
        .exec();
        
        res.status(200).send(user);

    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(502).send();
    }
};

// Fonction pour trouver un membre par pseudo
const findMemberByPseudo = async (pseudo) => {
    return await Profil.findOne({ pseudo })
        .select("amis -_id")
        .populate({ path: "amis", select: "_id" })
        .exec();
};

// Fonction pour vérifier si le membre recherché est ami avec l'utilisateur
const isFriend = (member, userId) => {
    return member.amis.some((ami) => String(ami._id) === userId);
};

// Fonction pour obtenir les détails d'un ami
const getFriendDetails = async (pseudo) => {
    return await Friend.findOne({ pseudo })
        .select("pseudo pantheon type_deite amis mur presentation -_id")
        .populate([
            { path: "amis", select: "pseudo -_id" },
            { path: "mur", select: "date titre contenu -_id" }
        ])
        .exec();
};

// Fonction pour obtenir les détails d'un client
const getClientDetails = async (pseudo) => {
    return await Friend.findOne({ pseudo })
        .select("pseudo pantheon type_deite presentation -_id")
        .exec();
};

// Fonction principale pour chercher un membre
export const searchForAMember = async (req, res) => {
    const userId = String(req.userId);

    try {
        const member = await findMemberByPseudo(req.body.pseudo);

        if (!member) {
            console.log("Membre non trouvé");
            return res.status(418).send();
        }

        if (isFriend(member, userId)) {
            const ami = await getFriendDetails(req.body.pseudo);
            res.send(ami);
        } else {
            const client = await getClientDetails(req.body.pseudo);
            res.send(client);
        }
    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(502).send();
    }
};

//fonction pour supprimer un ami
export const deleteFriend = async (req,res) => {
    const userId = req.userId;

    try {
        const user = await Profil.findById(userId)
            .select("pseudo amis")
            .lean()
            .exec();
        const exAmi = await Profil.findOne(req.body)
            .select("adresse_mail amis")
            .lean()
            .exec();

        const newListFriendsUser = user.amis.filter((ami) => String(ami._id) !== String(exAmi._id));
        const newListFriendsEx = exAmi.amis.filter((ami) => String(ami._id) !== String(userId));

        const cursorUser = await Profil.findById(userId);
        const cursorExAmi = await Profil.findOne(req.body);

        cursorUser.amis = newListFriendsUser;
        await cursorUser.save();

        cursorExAmi.amis = newListFriendsEx;
        await cursorExAmi.save();

        warnExFriend(user.pseudo, req.body.pseudo, exAmi.adresse_mail);

        res.status(201).send();

    } catch (error) {
        console.log("Erreur dans la suppression de l'ami : ", error);
        res.status(502).send();
    }
};

