import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { db } from "../db/index.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "All Fields are Requred");
  }

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      password: hashPassword,
      name,
      role: UserRole.USER,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const options = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  res.cookie("jwt", token, options);

  return res.status(201).json(new ApiResponse(
    201,
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    "User created successfully")
  );
});

const login = asyncHandler(async(req,res)=>{
    const {email , password} = req.body;

    if(!email && !password){
        throw new ApiError(400,"email and password are requred");
    }

    const user = await db.user.findUnique({
        where:{
            email
        }
    })

    if(!user){
        throw new ApiError(401,"User not found")
    }

    const token = jwt.sign({id:user.id} , process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt" , token , {
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
    })

    return res.status(200).json(new ApiResponse(
        200,
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
        "User Logged in successfully")
      );

    
})

const logout = asyncHandler(async(req,res)=>{
    res.clearCookie("jwt" , {
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{},"User logged out successfully"))

})

const check = asyncHandler((req,res)=>{

    return res.status(200)
    .json(new ApiResponse(200,req.user,"User authenticated successfully"))

})

export {register,login,logout,check}
