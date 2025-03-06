const BASE_URL = "http://localhost:3000";

const apiClient = async (endpoint, method = "GET", body = null) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Automatically includes cookies/sessions
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error; // Rethrow for handling in the component
    }
};

export default apiClient;
