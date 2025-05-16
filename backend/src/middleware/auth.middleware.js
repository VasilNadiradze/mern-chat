import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "გაიარეთ აუტენტიფიკაცია" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "წვდომის არასწორი სტრიქონი" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // პაროლის გარდა

    if (!user) {
      return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "სერვერული ხარვეზი" });
  }
};
