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
//auth middleware to check jwt or api key 
const authmiddleware=async (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    const apikey= req.query.api_key;

    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user= decoded;
            return next();
        }
        catch(err){
            return res.status(401).json({error:"Invalid or expired token"});
        }
    }

    if(apikey){
        const user= await User.findOne({apiKey:apikey});
        if(!user){
            res.json({message:"Invalid API Key"});
        }
        req.user=user;
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
            user.requestsMade=0;
            user.lastrequest=now;
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

userrouter.get("/previewurl",authmiddleware,requestlimitmiddleware,async (req, res) => {
  try {
    const { url } = req.query;
    if(!url){
        return res.status(400).json({error:"url is required"});
    }
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    res.json({ title, description, image ,url});
  } catch (err) {
    res.status(500).json({ error:   "Could not fetch url data" });
  }
});

module.exports = userrouter;
