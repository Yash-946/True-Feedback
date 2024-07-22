import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  // console.log(user);
  
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not authenticated"
    }, { status: 401 })
  }

  const userID = user._id;
  const { acceptMessages } = await request.json();
  try {
    // console.log(acceptMessages);
    
    const updateUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    // console.log(updateUser);
    
    if (!updateUser) {
      return Response.json({
        success: false,
        message: "Unable to find user to update message acceptance status"
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: "Message acceptance status updated successfully"
    }, { status: 200 })

  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: "Error updating message acceptance status"
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not authenticated"
    }, { status: 401 })
  }

  const userID = user._id;
  try {
    const foundUser = await UserModel.findById(userID);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }

}
