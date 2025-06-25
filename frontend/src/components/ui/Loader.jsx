import { Loader2 } from 'lucide-react'

function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
}

export default Loader
