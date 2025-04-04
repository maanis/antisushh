export const userDefaultPfp = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg'

export const userCoverPfp = 'https://flowbite.com/docs/images/examples/image-3@2x.jpg'


export const fileToUrl = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};

export const extractTime = (createdAt) => new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


export const timeAgo = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const units = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const unit of units) {
        const count = Math.floor(diff / unit.seconds);
        if (count >= 1) return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
    }

    return "just now";
};

export const formatTime = (isoString) => {
    const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};



