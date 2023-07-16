
interface FormLegendType {
    label: string
}

export function FormLegend({ label }: FormLegendType) {
    return (
        <h2 className="hidden md:flex md:justify-center font-medium text-4xl leading-[2.815rem]">
            {label}
        </h2>
    )
}