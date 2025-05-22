export interface FavoriteContextType {
    favoriteCategories: string[]
    toggleFavorite: (categoryID: string) => void
    isFavorite: (categoryID: string) => boolean
    clearFavorites: () => void
    hasFavorites: boolean
}