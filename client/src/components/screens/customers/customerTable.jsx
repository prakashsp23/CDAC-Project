import React from 'react'
import { Section } from '@/components/ui/section'
import { CustomerDataTable } from './customerTable/customerDataTable'

function CustomerTable() {
    return (
        <Section className='p-8'>
            <CustomerDataTable />
        </Section>
    )
}

export default CustomerTable