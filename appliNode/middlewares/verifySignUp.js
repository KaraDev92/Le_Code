//vérifie si le pseudo et/ou l'email du nouveau membre existe déjà

import { NewMember } from "../mongoDB/lesShemas.js";


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

export const verifyEmail = async (req, res) => {
  const email = req.params.id;
  const userByEmail = await NewMember.findOne({ adresse_mail: email }).exec();
  if (userByEmail) {
    console.log("Email already exists");
    res.send({ exists: true });
    return;
  }
  res.send(null);
  console.log("Email doesn't exist");
};

export const verifyPseudo = async (req, res) => {
  const pseudo = req.params.id;
  const userByEmail = await NewMember.findOne({ pseudo: pseudo }).exec();
  if (userByEmail) {
    console.log("Pseudo already exists");
    res.send({ exists: true });
    return;
  }
  res.send(null);
  console.log("Pseudo doesn't exist");
};
