const { Router } = require("express");
const userrouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cheerio = require("cheerio");
const User = require("../models/User");

userrouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      apiKey: Math.random().toString(36).slice(2),
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

userrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User not found" });
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {   
    res.status(500).json({ error: "Internal server error" });
  }
});

userrouter.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

userrouter.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

userrouter.put("/updateprofile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updatedUser = await User.findByIdAndUpdate(decoded.id, req.body, { new: true }).select("-password");
    res.json({ message: "Profile updated", updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

userrouter.post("/previewurl", async (req, res) => {
  try {
    const { url } = req.body;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    res.json({ title, description, image ,url});
  } catch (err) {
    res.status(500).json({ error:   "Could not fetch preview" });
  }
});

module.exports = userrouter;
