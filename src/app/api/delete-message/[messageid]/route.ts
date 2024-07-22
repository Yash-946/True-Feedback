import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(request: Request, 
  { params }: { params: { messageid: string } }) {

  const messageID = params.messageid;
  console.log(messageID);
  
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user;
  if(!session || !_user){
    return Response.json({
      success: false,
      message: "Not authenticated"
    },{status:401});
  }

  try {
    const updateResult = await UserModel.updateOne(
      {_id : _user._id},
      { $pull: {messages: {_id:messageID}}}
    )
    
    if(updateResult.modifiedCount === 0){
      return Response.json({
        success: false,
        message: "Message not found or already deleted"
      },{status: 404});
    }

    return Response.json({
      success: true,
      message: "Message deleted"
    },{status: 200});

  } catch (error) {
    console.error("Error deleteing message", error);
    return Response.json({
      success: false,
      message: "Error deleteing message"
    },{status: 500});
  }
}