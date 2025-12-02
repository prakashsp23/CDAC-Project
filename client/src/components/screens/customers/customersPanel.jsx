import React from 'react'
import { Section } from '@/components/ui/section'
import CustomersCard from './components/customersCard'

function CustomersPanel() {
  return (
    <Section className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold mb-16">This is the customers panel</h1>
      <CustomersCard />
    </Section>
  )
}

export default CustomersPanel