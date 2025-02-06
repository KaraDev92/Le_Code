// routes pour vérifier l'autorisation des utilisateurs (public, membre ou admin)

import { verifyToken, isAdmin } from "../middlewares/authJwt.js";
import { userBoard, allAccess, adminBoard } from "../controllers/userController.js";

export const userRouter = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", allAccess);

    app.get("/api/test/user", [verifyToken], userBoard);

    app.get(
        "/api/test/admin",
        [verifyToken, isAdmin],
        adminBoard
    );
};