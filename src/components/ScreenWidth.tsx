import { useEffect, useState } from "react"

export function ScreenWidth() {
    const [screenWidth, setScreenWidth] = useState<{ width: number }>({
        width: window.innerWidth
    })

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth({
                width: window.innerWidth
            })            
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return screenWidth.width
}