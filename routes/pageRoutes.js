import express from "express"
import {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} from "../controllers/authController.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.render("pages/landing")
})

router.get("/register", renderRegisterForm)
router.post("/register", registerUser)
router.get("/login", renderLoginForm)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

export default router
