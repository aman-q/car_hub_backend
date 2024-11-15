import User from '../modles/user.model.js'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation check from frontend

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ messaage: "No user existed with this email!" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ messaage: "Inavlid credential!" });
        }
        // Generate JWT token
        const token = generateToken(user);
        res.status(200).json({
            status: 200,
            message: "User logged in successfully",
            token,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phonenumber,
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server Error', error: err.message });

    }

};

export const register =async (req,res)=>{
    try{
        const {email,password,fname,lname,phonenumber}=req.body;

        const existingUser = await User.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone number already exists" });
        }
        const hasedPassword= await bcrypt.hash(password,10);
        const newuser= new User({
            fname,
            lname,
            email,
            phonenumber,
            password:hasedPassword
        });
        await newuser.save();
        const { password: _, ...userWithoutPassword } = newuser.toObject()

        return res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error", error:err.message});
    }
}