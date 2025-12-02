import Dashboard from './Pages/Dashboard'
import { Section } from '@/components/ui/section'
function AdminPanel() {
  return (
    <>
      <Section className='flex flex-col items-center justify-center'>
        <Dashboard />
      </Section>
    </>
  )
}

export default AdminPanel