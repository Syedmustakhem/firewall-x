import { Router }
from "express";
import {
 authorize
}
from "../middleware/rbac.middleware.js";
import {
 authMiddleware
}
from "../middleware/auth.middleware.js";

const router = Router();
router.get(
 "/admin",
 authMiddleware,
 authorize(
   "super_admin"
 ),
 (req, res) => {

   res.json({
     message:
      "Admin Access"
   });

 }
);
router.get(
 "/profile",
 authMiddleware,
 (req, res) => {

   return res.json({
     message:
      "Protected Route Works",
     user:
      (req as any).user
   });

 }
);

export default router;