import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
  await dbConnect()

  try {
    const {username, code} = await request.json();
    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username:decodeUsername
    });

    if(!user){
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpire){
      user.isVerified = true;
      await user.save();

      return Response.json({
        success:true,
        message: 'Account Verified successfully'
      },{status:200})
    }
    else if( !isCodeNotExpire){
      // code must be expire
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else{
      // last case: code wrong
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}