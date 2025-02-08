import mongoose from "mongoose";
const { Schema } = mongoose;

export const dataForProlile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Profil.findById(userId);
        res.send(user);

    } catch (err) {
        console.log('problème BDD : ', err);
        res.status(500).send();
    }
};

