import axios from "axios"

class ApiService {
    constructor() {
        this.baseURL = "http://localhost:8085/gateway/"

        // Create axios instance
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: 30000, // 30 seconds
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })

        // Add request interceptor to add auth token from cookie
        this.instance.interceptors.request.use(
            (config) => {
                // Get auth token from cookie
                const token = this.getAuthTokenFromCookie()

                // If token exists, add it to the headers
                if (token) {
                    config.headers = config.headers || {}
                    config.headers["Authorization"] = `Bearer ${token}`
                }

                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        // Add response interceptor for error handling
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle 401 Unauthorized errors (token expired)
                if (error.response?.status === 401) {
                    // You could redirect to login or refresh token here
                    console.log("Unauthorized, redirecting to login...")
                    // window.location.href = '/login';
                }

                return Promise.reject(error)
            },
        )
    }

    // Helper method to get auth token from cookie
    getAuthTokenFromCookie() {
        if (typeof document === "undefined") {
            return null // Return null on server-side
        }

        // Parse the auth cookie
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=")
            if (name === "auth") {
                try {
                    const authData = JSON.parse(decodeURIComponent(value))
                    // If your cookie contains the token directly
                    if (authData.token) {
                        return authData.token
                    }
                    // If your cookie contains a user object (as in your example)
                    // You might need to generate a token or use an ID
                    // This depends on your backend implementation
                    return authData.id?.toString() || null
                } catch (e) {
                    console.error("Error parsing auth cookie:", e)
                    return null
                }
            }
        }

        return null
    }

    // Public methods for API calls
    async get(url, config) {
        console.log("url", url)
        return this.instance.get(url, config)
    }

    async post(url, data, config) {
        return this.instance.post(url, data, config)
    }

    async put(url, data, config) {
        return this.instance.put(url, data, config)
    }

    async delete(url, config) {
        return this.instance.delete(url, config)
    }

    async patch(url, data, config) {
        return this.instance.patch(url, data, config)
    }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService