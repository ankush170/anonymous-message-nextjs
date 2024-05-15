import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {Message} from "@/model/User.model";


export async function POST(request : Request){
    await dbConnect()

    const {username, content} = await request.json()
    
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {status : 404}
            )
        }

        //is user accepting messages or not
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false,
                    message : "User is not accepting messages"
                },
                {status : 403}
            )
        }

        const newMessage = {content, createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success : true,
                message : "Message sent Successfully!"
            },
            {status : 200}
        )
    } catch (error) {
        console.error("An unexpected error occured while sending message ",error)
        return Response.json(
            {
                success : false,
                message : "An unexpected error occured while sending message "
            },
            {status : 500}
        )
    }
}