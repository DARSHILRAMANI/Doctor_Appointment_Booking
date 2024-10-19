// import jwt from "jsonwebtoken";

// //middleware
// const authUser = async (req, res, next) => {
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "1 Not Authorized Login Again",
//       });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);

//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

// Middleware to authenticate users
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers; // Extract token from headers
    if (!token) {
      return res.status(401).json({
        // Use status code for unauthorized access
        success: false,
        message: "Not Authorized. Please log in again.",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.body.userId = token_decode.id; // Attach user ID to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(401).json({
      // Use status code for unauthorized access
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
