import { createContext } from "react"

export interface RefreshOpenOrderContextProps {
    refresh: boolean,
    setRefresh: (newRefresh: boolean) => void
}

export const RefreshOpenOrderContext = createContext<RefreshOpenOrderContextProps | undefined>(undefined)

export interface ModalAddDishContextProbs {
    modalAddItem: boolean,
    setModalAddItem: (newRefresh: boolean) => void
}

export const ModalAddDishContext = createContext<ModalAddDishContextProbs | undefined>(undefined)