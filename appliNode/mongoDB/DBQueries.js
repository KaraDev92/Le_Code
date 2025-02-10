//pour répondre aux requêtes HTTP de données dans la BDD

import { Profil } from "../mongoDB/lesShemas.js";

export const dataForProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId)
        .select("pseudo pantheon type_deite amis mur date_derniere_connexion -_id")
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

