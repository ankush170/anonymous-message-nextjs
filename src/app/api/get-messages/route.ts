import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status : 401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id); //we are writing is like this because user._id is set as string, which may cause problems while writing aggregation pipelines

    try {
        //now we will apply multiple aggregation pipelines to get messages wrt users
        const user = await UserModel.aggregate([
            {
                $match : {id : userId}
            },
            //we are unwinding the messages received in the for of an array into individual objects
            {
                $unwind : '$messages'
            },
            {
                $sort : {'messages.createdAt' : -1}
            },
            {
                $group : {
                    _id : '$_id',
                    messages : {$push : '$messages'}
                }
            }
        ])

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status : 401}
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {status : 401}
        )
    } catch (error) {
        console.error("An unexpected error occured while getting the messages ",error)
        return Response.json(
            {
                success : false,
                message : "An unexpected error occured while getting the messages "
            },
            {status : 500}
        )
    }
}