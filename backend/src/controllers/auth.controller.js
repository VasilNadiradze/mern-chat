import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!req.body || !fullName || !email || !password) {
      return res.status(400).json({ message: "გთხოვთ შეავსოთ ყველა ველი" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "პაროლი უნდა შეიცავდეს 6 სიმბოლოზე მეტს" });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({ message: "ელ_ფოსტა უკვე გამოყენებულია" });
    }

    // წინ ერთვის პაროლს დაჰეშვამდე, ერთნაირებიც რომ აკრიფონ საბოლოოდ ჰეში მაინც სხვადასხვაა
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName, // ბაზის ველის დასახელება ემთხვევა ცვლადის სახელს
      email, // ბაზის ველის დასახელება ემთხვევა ცვლადის სახელს
      password: hashedPassword, // ბაზის ველის დასახელება არ ემთხვევა ცვლადის სახელს
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "არასწირი ინფორმაცია" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "სერვერული ხარვეზი რეგისტრაციისას" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!req.body || !email || !password) {
      return res.status(400).json({ message: "გთხოვთ შეავსოთ ველები" });
    }

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      return res.status(400).json({ message: "არასწორი მომაცემები" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "არასწორი მომაცემები" });
    }

    generateToken(existedUser._id, res);

    res.status(201).json({
      _id: existedUser._id,
      fullName: existedUser.fullName,
      email: existedUser.email,
      profilePic: existedUser.profilePic,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "სერვერული ხარვეზი აუტენტიფიკაციისას" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "თქვენ წარმატებით გახვედით სისტემიდან" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "სერვერული ხარვეზი სისტემიდან გასვლისას" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "ატვირთეთ ფოტო" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "სერვერული ხარვეზი" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "სერვერული ხარვეზი" });
  }
};
