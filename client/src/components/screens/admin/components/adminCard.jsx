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
            <CardContent>
                <p>Content</p>
            </CardContent>
            <CardFooter>
                <p> Footer</p>
            </CardFooter>
        </Card>
    )
}

export default AdminCard