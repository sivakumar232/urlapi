const {Router}=require('express')
const previewrouter=Router()
previewrouter.get('/test',(req,res,next)=>{
    res.json({message:"test"})
})
module.exports= previewrouter;
