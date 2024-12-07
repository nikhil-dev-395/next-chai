import dbConnect from "@/lib/dbConnect.lib";
import userModel from "@/models/User.models";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if the username is already taken and verified
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username already taken",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the email exists
    const existingUser = await userModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existingUser) {
      // Handle unverified user with existing email
      if (existingUser.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email is already registered",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      // Update the unverified user
      existingUser.password = hashedPassword;
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpiry = expiryDate;
      await existingUser.save();
    } else {
      // Create a new user
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );
    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Verification email sent.",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error at registering user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error at registering user",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
