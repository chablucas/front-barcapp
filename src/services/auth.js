export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // renvoie true si un token existe
};
