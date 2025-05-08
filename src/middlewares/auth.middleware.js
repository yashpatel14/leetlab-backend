import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        const user = await db.user.findUnique({
            where:{
                id:decodedToken.id
            },
            select:{
                id:true,
                image:true,
                name:true,
                email:true,
                role:true
            }
        });
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

export const checkAdmin = asyncHandler(async(req,_,next)=>{
    try {
        const userId = req.user.id;
        
        const user = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true
            }
        })

        if(!user || user.role !== "ADMIN"){
            throw new ApiError(403,"Access denied - Admins only")
                   }

        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        throw new ApiError(500, error?.message || "Error checking admin role")
        
    }
})