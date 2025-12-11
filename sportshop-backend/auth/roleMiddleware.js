const jwt = require("jsonwebtoken");
const JWT_SECRET = "a9f83j2hf98h23f98h23fh289fh238f2398fh2398fh2398fh"; 

module.exports = function (requiredRole) {
    return (req, res, next) => {
        if (req.method === "OPTIONS") return next();

        try {
            // Отримуємо токен
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(403).json({message: "No token provided"});
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Token is empty"});
            }
            
            // Розшифровуємо токен
            const user = jwt.verify(token, JWT_SECRET);
            
            // === ДЕБАГ (Дивіться в термінал!) ===
            console.log(`👤 User Role: '${user.role}'`); 
            console.log(`🔒 Required Role: '${requiredRole}'`);

            // Перевірка (ігноруємо регістр: Admin == admin)
            const userRoleLower = String(user.role).toLowerCase();
            const requiredRoleLower = String(requiredRole).toLowerCase();

            if (userRoleLower !== requiredRoleLower) {
                console.log("❌ Ролі не співпадають!");
                return res.status(403).json({
                    message: `Access denied. You have role '${user.role}', but needed '${requiredRole}'`
                });
            }
            
            // Зберігаємо юзера для використання в контролерах
            req.user = user;
            next();
        } catch (e) {
            console.log("Помилка перевірки токена:", e.message);
            return res.status(403).json({message: "User not authorized"});
        }
    }
};