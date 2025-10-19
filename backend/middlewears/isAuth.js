import jwt from "jsonwebtoken"

// middlewear that take token from cookies and send it to current user controller 
// for checking user by use of token in cookies
const isAuth = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({message:'token not found!'})
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeToken) {
          return res.status(400).json({ message: "token verification failed!" });
        }
        req.userId = decodeToken.userId;
        next();
    } catch (error) {
        if (!token) {
          return res.status(500).json({ message: "isAuth error!" });
        }
    }
}

export default isAuth