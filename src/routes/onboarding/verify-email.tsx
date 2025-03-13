import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/verify-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/onboarding/verify-email"!</div>
}
