import express from 'express';
import connectDb from "./config/db.js";
import index from "./router/index.js"


const app = express();

app.get('/',(req,res)=>{
    res.send("Spyne.ai Task Backend is Running");
});

app.use('/api',index)
connectDb();
export default app;