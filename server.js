import app from './src/app.js';
import logger from './src/utils/logger.js';

const port = process.env.PORT || 5001;

app.listen(port ,()=>{
    logger.info(`Server is Runnig on ${port}`);
})