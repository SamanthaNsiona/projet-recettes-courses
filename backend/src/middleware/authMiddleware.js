const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  console.log('\nMIDDLEWARE PROTECT');
  console.log('Token présent:', !!token);
  
  if (!token) {
    console.log('Pas de token');
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token décodé:', { id: decoded.id, role: decoded.role });
    next();
  } catch (error) {
    console.log('Token invalide:', error.message);
    res.status(403).json({ message: "Token invalide" });
  }
};

const isAdmin = (req, res, next) => {
  console.log('\nMIDDLEWARE ISADMIN');
  console.log('User:', req.user);
  console.log('Role:', req.user?.role);
  
  if (!req.user || req.user.role !== "ADMIN") {
    console.log('Accès refusé - Role:', req.user?.role);
    return res.status(403).json({ message: "Accès interdit" });
  }
  
  console.log('Admin vérifié');
  next();
};

module.exports = { protect, isAdmin };

