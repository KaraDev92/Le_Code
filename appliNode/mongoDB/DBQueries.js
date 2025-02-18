//pour répondre aux requêtes HTTP de données dans la BDD

import { Profil, Friend } from "../mongoDB/lesShemas.js";
import mongoose from "mongoose";
import { refusMail, warnExFriend } from "../middlewares/messenger.js";

//pour récupérer les données de son profil
export const dataForProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId)
        .select("pseudo pantheon type_deite amis mur date_derniere_connexion presentation req_ami -_id")
        .populate([
            {path: "amis", select:"pseudo -_id"}, 
            {path: "mur",select: "date titre contenu -_id"},
            {path: "req_ami", select: "pseudo"}
        ])
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

//gérer la réponse à une demande d'amitité
export const responseFriend = async (req, res) => {
    const answer = req.body.rep;
    const asker = req.body.pseudo;
    const userId = req.userId;

    try {
        const cursorAskerId = await Profil.findOne({pseudo : asker});
        const cursorUser = await Profil.findById(userId);

        const user = await Profil.findById(userId)
        .select("req_ami")
        .lean()
        .exec();

        const newListReq_ami = user.req_ami.filter((req) => String(req._id) !== String(cursorAskerId._id));
        cursorUser.req_ami = newListReq_ami;
        await cursorUser.save();

        if (answer) {
            cursorAskerId.amis.push(userId);
            cursorUser.amis.push(cursorAskerId._id);

            await cursorAskerId.save();
            await cursorUser.save();
        } else {
            const askerEmail = await Profil.findOne({pseudo : asker})
                .select("adresse_mail")
                .lean()
                .exec();
            console.log('asker ID email : ',askerEmail.adresse_mail);
            await refusMail(cursorUser.pseudo, askerEmail.adresse_mail, asker);
        }
    } catch (error) {
        console.log("Erreur dans la gestion du refus d'amitié : ", error);
        res.status(502).send();
    }
}

