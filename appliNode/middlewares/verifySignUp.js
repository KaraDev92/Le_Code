import { NewMember } from "../mongoDB/lesShemas.js";

//vérifie si le pseudo et/ou l'email du nouveau membre existe déjà

export const verifySignUp = async (req, res, next) => {
    // Username
    const userByUsername = await NewMember.findOne({ pseudo: req.body.pseudo }).exec();
    if (userByUsername) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
  
    // Email
    const userByEmail = await NewMember.findOne({ adresse_mail: req.body.email }).exec();
    if (userByEmail) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
  
    next();
  };