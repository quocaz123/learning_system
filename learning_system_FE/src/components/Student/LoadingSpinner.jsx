
const LoadingSpinner = (label) => {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {label}
        </div>
    )
}
export default LoadingSpinner;