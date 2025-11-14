// src/app/dashboard/inserieren/[id]/page.tsx
import { redirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function InserierenIdRedirectPage(props: PageProps) {
  const { id } = await props.params
  // Leite auf die bestehende Inserieren-Page mit ?listing= weiter
  redirect(`/dashboard/inserieren?listing=${id}`)
}
