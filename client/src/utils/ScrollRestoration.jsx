import { useEffect, useState } from "react";

const MyComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from backend
        const fetchData = async () => {
            try {
                const response = await fetch("https://your-backend-api.com/posts");
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Restore scroll position *only* after data is loaded
        if (!loading) {
            const savedPosition = sessionStorage.getItem("scrollPosition");
            if (savedPosition !== null) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                }, 100); // Delay to allow content rendering
            }
        }
    }, [loading]); // Runs only when `loading` changes

    useEffect(() => {
        // Save scroll position before refresh
        const saveScrollPosition = () => {
            sessionStorage.setItem("scrollPosition", window.scrollY);
        };

        window.addEventListener("scroll", saveScrollPosition);
        window.addEventListener("beforeunload", saveScrollPosition);

        return () => {
            window.removeEventListener("scroll", saveScrollPosition);
            window.removeEventListener("beforeunload", saveScrollPosition);
        };
    }, []);

    return (
        <div>
            {loading ? <p>Loading...</p> : <div>{/* Render your posts here */}</div>}
        </div>
    );
};

export default MyComponent;
