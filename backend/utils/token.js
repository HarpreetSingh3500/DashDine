import jwt from "jsonwebtoken"

// token generator function with some secret using jwt
const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token
    } catch (error) {
        console.log(error);
        
    }
}

export default genToken;