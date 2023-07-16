import { createContext } from "react"

export interface DisableDeleteButtonContextProps {
    disable: boolean,
    setDisable: (newRefresh: boolean) => void
}

export const DisableDeleteButtonContext = createContext<DisableDeleteButtonContextProps | undefined>(undefined)