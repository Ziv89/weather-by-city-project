export const readFavoritesFromLocalStorage = () => {
  try {
    const storedValue = window.localStorage.getItem("localFavorites");
    return storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const writeFavoritesToLocalStorage = (favorites) => {
  try {
    window.localStorage.setItem("localFavorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};