import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../../../ui/card'
import React from 'react'

function MechanicCard() {
    return (
        <Card className='w-[20rem]'>
            <CardHeader>
                <CardTitle>Mechanic Name</CardTitle>
                <CardDescription> Description</CardDescription>
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

export default MechanicCard