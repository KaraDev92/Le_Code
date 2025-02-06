//routes pour vérifier l'authentification des utilisateurs

import { verifySignUp } from "../middlewares/verifySignUp.js";
import { signup, signin } from "../controllers/authController.js";

export const authRouter = (app) => {
    //pour les nouveaux membres
    app.post(
        "/newuser",
        verifySignUp,
        signup
    );

    //pour se loguer
    app.post("/login", signin);
};