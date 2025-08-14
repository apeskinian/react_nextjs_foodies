import Link from "next/link"

export default function MealsPage() {
    return (
        <>
            <h1>Meals</h1>
            <p><Link href="/meals/share">Share</Link></p>
        </>
    )
}