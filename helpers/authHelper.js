import bcrypt from "bcrypt";

// hash password before saving in database using bcrypt
export const hashPassword = async (password) => {
  try {
    // generate salt to hash password
    const saltRounds = 10;
    // to generate hashed password using salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console, log("error in hashing password", error.message);
  }
};

// compare password with hashed password in database
export const comparePassword  = async(password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.log("error in comparing password", error.message);
    }
}
