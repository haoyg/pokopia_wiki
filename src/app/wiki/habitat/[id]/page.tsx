export default function HabitatDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      <h1>Habitat: {params.id}</h1>
      <p>Habitat details will go here</p>
    </main>
  )
}
