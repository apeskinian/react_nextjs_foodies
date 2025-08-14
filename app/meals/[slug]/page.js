export default function MealsDynamicPage({ params }) {
    return (
        <>
            <main>
                <h1>Dynamic Page</h1>
                <p>{params.slug}</p>
            </main>
        </>
    )
}