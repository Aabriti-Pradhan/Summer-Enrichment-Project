function verifyUserController(req, res) {
  if (req.user) {
    res.status(200).json({
      message: "User is Authenticated",
      user: {
        name: req.user.name,
        email: req.user.email,
        bio: req.user.bio,
        skills: req.user.skills,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ message: "User is not Authenticated" });
  }
}

module.exports = { verifyUserController };
