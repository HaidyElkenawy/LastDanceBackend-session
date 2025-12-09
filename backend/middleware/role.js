function roleMiddleware(...roles) {
    return function (req, res, next) {
        const userRole = req.user.Role;
        if(!userRole){
            return res.status(401).json({ message: "unauthorized" });
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: "forbidden" });
        }
        next();
    }
}

module.exports = roleMiddleware;