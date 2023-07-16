export const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, search: string) => {
    if (event.key === 'Enter') {
        window.localStorage.setItem('@foodexplorer:searchBar', search)
        window.localStorage.removeItem("@foodexplorer:location")

        window.location.replace('/')
    }
}