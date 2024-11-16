import express from 'express';
import bodyParser from 'body-parser';
import connectDb from "./config/db.js";
import cors from 'cors';
import index from "./router/index.js"


const app = express();
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.get('/',(req,res)=>{
    res.send("Spyne.ai Task Backend is Running");
});


app.use(bodyParser.json());
app.use('/api',index)
connectDb();
export default app;