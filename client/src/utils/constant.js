export const userDefaultPfp = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg'


export const fileToUrl = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};