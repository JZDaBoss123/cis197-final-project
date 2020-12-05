const isAuthenticated = (req, res, next) => {
    if (req.session.username === null || req.session.password === null) {
      next(new Error("user is not logged in!"));
    } else {
      if (req.session.username !== "" && req.session.password !== "") {
        next();
      } else {
        next(new Error("user is not logged in!"));
      }
    }
  };
  
  module.exports = isAuthenticated;