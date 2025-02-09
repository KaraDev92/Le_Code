import { Profil } from "../mongoDB/lesShemas.js";

export const dataForProlile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId).populate().select("pseudo pantheon type_deite amis mur date_derniere_connexion -_id").exec();
        res.send(user);

    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(500).send();
    }
};

