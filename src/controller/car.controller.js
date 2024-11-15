import Car from '../modles/cars.model.js';

export const getallcars = async (req,res)=>{
    try{
        const car= await Car.find();
        res.status(200).json(car);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
