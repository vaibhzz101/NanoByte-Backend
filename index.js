const express = require("express");
const { Configuration,OpenAIApi } =require("openai");
const cors=require("cors")
require("dotenv").config();
const {connection} = require("./config/db")
const {authentication} = require("./middleware/authentication")
const {userRouter} = require("./routes/user.routes")


const openai=new OpenAIApi(new Configuration({
    apiKey:process.env.API_KEY
  }))


const app=express()

 app.use(cors())

 app.use(express.json())
 app.get('/', (req,res)=>{
    res.send("Welcome to NanoByte")
})
app.use("/user", userRouter);

app.use(authentication);
 app.post("/result",(req,res)=>{
    const {prompt} = req.body;

    console.log(process.env.API_KEY)

     if (!prompt) {
        return res.status(400).send({error: 'Prompt is missing in the request'});
    }
       try {
           openai.createChatCompletion({
               model:"gpt-3.5-turbo",
               messages:[{role:"user",content:prompt}]
           }).then((data)=>{
               res.status(200).send(data.data.choices[0])
           })
       } catch (error) {
        return res.status(500).send(error.messages)
       }

 })


 app.listen(process.env.PORT, async()=>{
try{
    await connection;
    console.log(`connected to DB and running on ${process.env.PORT}`)
}
catch(err){
    console.log(err)
}
 })