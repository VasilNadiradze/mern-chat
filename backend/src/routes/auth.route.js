import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.send("რეგისტრაცია");
});

router.post("/login", (req, res) => {
  res.send("აუტენტიფიკაცია");
});

router.post("/logout", (req, res) => {
  res.send("გასვლა");
});

export default router;
