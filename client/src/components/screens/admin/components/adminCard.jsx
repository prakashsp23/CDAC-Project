import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import React from 'react'

function AdminCard() {
    return (
        <Card className='w-[20rem]'>
            <CardHeader >
                <CardTitle>Admin Name</CardTitle>
                <CardDescription>Description</CardDescription>
                {/* <CardAction>Admin Action</CardAction> */}
            </CardHeader>
            {/* content and footer intentionally left empty for now */}
        </Card>
    )
}

export default AdminCard