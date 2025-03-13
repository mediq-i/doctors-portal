import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/onboarding/personal-professional-information',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/onboarding/personal-professional-information"!</div>
}
