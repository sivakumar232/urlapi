const { Router } = require("express");
const userrouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cheerio = require("cheerio");
const User = require("../models/User");
const Preview = require("../models/Preview");

userrouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique API key (timestamp + random)
    const apiKey = Math.random().toString(36).slice(2) + Date.now().toString(36);

    // Create new user
    const newUser = new User({
      username, 
      email,
      password: hashedPassword,
      apiKey,
      requestLimit: 50,  // optional default limit
      requestsMade: 0,
      lastRequestAt: new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err); // log the real error
    res.status(500).json({ error: "Internal server error" });
  }
});


userrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        apiKey: existingUser.apiKey,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//auth middleware to check jwt or api key 
const authmiddleware=async (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    const apikey= req.query.api_key;
if(token){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); // get full user document
        if(!user) return res.status(401).json({error:"User not found"});
        req.user = user;
        return next();
    } catch(err) {
        return res.status(401).json({error:"Invalid or expired token"});
    }
}

if(apikey){
    const user = await User.findOne({ apiKey });
    if(!user){
        return res.status(401).json({message:"Invalid API Key"});
    }
    req.user = user;
    return next();
}

    else{
        return res.status(401).json({error:"No token provided"});
    }
}


//http://localhost:3000/api/user/preview?api_key=qup08fu19n example for profile fetching using api key

userrouter.get("/profile", authmiddleware,async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
        username: user.username,
        email: user.email,
        apikey: user.apiKey,
        requestMade: user.requestsMade,
        requestLimit: user.requestLimit
    });
  } catch (err) {
    res.status(401).json({ error:"Internal Server Error" });
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

const requestlimitmiddleware= async (req,res,next) => {
    try{
        const user =req.user;
        if(!user){
            return res.status(401).json({error:"User not found"});
        }
        const now= new Date();
        
        const hourssincelastreq=(now-user.lastRequestAt)/3600000;

if(hourssincelastreq>=24){
    user.requestsMade = 0;
    user.lastRequestAt = now;
}

        if(user.requestsMade>=user.requestLimit){
            return res.status(429).json({error:"Request limit exceeded"});
        }
        user.requestsMade++;
            await user.save();
        next();

    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }


}

//http://localhost:3000/api/user/previewurl?api_key=qup08fu19n&url=https://my.linkpreview.net/ example for profile fetching using api key

userrouter.get("/previewurl", authmiddleware, requestlimitmiddleware, async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text() || "";
    const description = $('meta[name="description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";

    // Save preview to DB
    const preview = await Preview.create({
      userId: req.user._id, // works for both JWT and API key auth
      url,
      title,
      description,
      image,
    });

    res.json({
      title: preview.title,
      description: preview.description,
      image: preview.image,
      url: preview.url,
    });

  } catch (err) {
    console.error("Preview fetch error:", err.message);
    res.status(500).json({ error: "Could not fetch url data" });
  }
});

userrouter.post("/regenerate-apikey", authmiddleware, async (req, res) => {
  try {
    const newKey = Math.random().toString(36).slice(2);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { apiKey: newKey },
      { new: true }
    ).select("-password");
    res.json({ message: "API key regenerated successfully", apiKey: newKey });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
userrouter.get("/stats", authmiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      username: user.username,
      totalRequests: user.requestsMade,
      remainingRequests: user.requestLimit - user.requestsMade,
      lastRequestAt: user.lastRequestAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


userrouter.get("/history", authmiddleware, async (req, res) => {
  try {
    const previews = await Preview.find({ userId: req.user.id }).sort({ fetchedAt: -1 });
    res.json(previews);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

userrouter.delete("/delete", authmiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = userrouter;
