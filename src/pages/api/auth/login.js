import axios from "axios";

export default function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"})
    }
    try {
        const {email, password} = req.body

        // This is where you would validate the user credentials
        // For example, check against a database

        // Example validation (replace with actual authentication logic)

        const response = axios.post("http://localhost:8085/gateway/auth/create-token", {email, password})
            .then(response => {
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                const token = response.data.result.access_token
                // Set the cookie with HttpOnly flag for security
                res.setHeader("Set-Cookie", [
                    `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`,
                ])

                // Return success response
                return res.status(200).json({
                    success: true,
                    message: "Giriş başarılı",
                    token: token,
                })
            })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu",
        })
    }
}