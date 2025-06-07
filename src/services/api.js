const API_URL = "http://localhost:5000/api";

export const getVideos = async () => {
    const response = await fetch(`${API_URL}/videos`);
    if (!response.ok) throw new Error("Erreur lors du chargement des vidéos");
    return response.json();
};
