import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/info-card')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/onboarding/info-card"!</div>
}
