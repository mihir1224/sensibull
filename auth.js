exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(token);
  if (!token) {
    res.status(400).json({ msg: "x-auth-token is required." });
  } else {
    if (token.length < 12) {
      res.send({ token_error: "token must be in 12 character." });
    }
  }
  try {
    next();
  } catch (error) {
    res.status(401).json(error.message);
  }
};
