const BASE_URL = "https://antisushh.onrender.com";

const apiClient = async (endpoint, method = "GET", body = null) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export default apiClient;
