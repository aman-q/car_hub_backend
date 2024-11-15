import express from 'express';
import { getallcars } from '../controller/car.controller.js';

const carRouter = express.Router();

carRouter.get('/',getallcars);

export default carRouter;