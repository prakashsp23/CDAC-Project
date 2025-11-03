import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card'

function CustomersCard() {
    return (
        <Card className='w-[20rem]'>
            <CardHeader >
                <CardTitle>Customer Name</CardTitle>
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

export default CustomersCard