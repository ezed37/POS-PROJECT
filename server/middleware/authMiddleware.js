import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; //Get the token only, remove "bearer"

      //verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Add user data from token into request
      req.user = decoded;

      next();
    } else {
      res.status(401).json({ message: "No token, denied authorization!" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token!" });
  }
};
