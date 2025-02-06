import { NewMember } from "../mongoDB/lesShemas";

//vérifie si le pseudo et/ou l'email du nouveau membre existe déjà
export const verifySignUp = (req, res, next) => {
  // Username
    NewMember.findOne({
        pseudo: req.body.pseudo
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

    if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
    }

    // Email
    NewMember.findOne({
        adresse_mail: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();
    });
  });
};