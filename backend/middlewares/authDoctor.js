import jwt from "jsonwebtoken";

// Middleware to doctor users
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers; // Extract token from headers
    if (!dtoken) {
      return res.status(401).json({
        // Use status code for unauthorized access
        success: false,
        message: "Not Authorized. Please log in again.",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET); // Verify the token
    req.body.docId = token_decode.id; // Attach user ID to request
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

export default authDoctor;
