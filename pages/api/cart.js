import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import {getSession} from 'next-auth/react';

export default async function handler(req, res){
    const session = await getSession({req});

    if(!session){
        return res.status(401).json({message:'unauthorized'});

    }

    await dbConnect();

    const user= await User.findOne({email:session.user.email});
    if(!user){
        return res.status(404).json({messag:'User not found'});
    }

    if(req.method==='GET'){
        return res.status(200).json({cart: user.cart || []});
    }

    if(req.method==='POST'){
        const {cart}= req.body;
        user.cart=cart;
        await user.save();
        return res.status(200).json({message:'cart updated'})
    }

    res.setHeader('Allow',['GET','POST']);
    res.status(405).end(`method ${req.method} not allowed`);
}