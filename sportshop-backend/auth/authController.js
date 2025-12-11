const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "a9f83j2hf98h23f98h23fh289fh238f2398fh2398fh2398fh"; 

module.exports = {
    register: (req, res) => {
        // ВИПРАВЛЕНО: змінили Username, Email, Password на маленькі літери
        const { username, email, password } = req.body;

        // Перевіряємо змінні з маленькими літерами
        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const hash = bcrypt.hashSync(password, 10); 

       
        const sql = `
            INSERT INTO users (Username, Email, PasswordHash, Role)
            VALUES (?, ?, ?, 'user')
        `;

        
        db.query(sql, [username, email, hash], (err, result) => {
            if (err) {
                console.error(err); 
                return res.status(500).json({ error: err });
            }
            res.json({ message: "User registered", id: result.insertId });
        });
    },

    login: (req, res) => {
    
    const { email, password } = req.body; 

    
    const sql = "SELECT * FROM users WHERE Email = ?";
    
    db.query(sql, [email], (err, users) => {
        if (err) return res.status(500).json({ error: err });
        if (users.length === 0)
            return res.status(400).json({ message: "User not found" });

        const user = users[0];

        
        const correct = bcrypt.compareSync(password, user.PasswordHash);
        if (!correct)
            return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            {
                id: user.UserID,
                role: user.Role,
                username: user.Username,
                email: user.Email
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token,
        });
    });
}
};