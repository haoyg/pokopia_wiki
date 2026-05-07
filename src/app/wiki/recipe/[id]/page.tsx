export default function RecipeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      <h1>Recipe: {params.id}</h1>
      <p>Recipe details will go here</p>
    </main>
  )
}
