
const isSuperAdmin = async (req,res,next) => {
  try {
    const { user } = req;
    console.log(user);
    if (user.role !== "super-admin") {
      return res.status(403).json({
        error: true,
        message: "You are not authorized only super admin can access this route",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error ",
      error: error.message,
    });

  }
}

export default isSuperAdmin