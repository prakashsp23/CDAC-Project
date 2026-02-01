import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/button'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '../ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useGetCurrentUser, useUpdateCurrentUserMutation } from '../../query/queries/userQueries'
import { useNavigate } from 'react-router-dom'
import ForgotPasswordPage from './auth/ForgotPasswordCard'

// Validation schema
const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
})

export default function ProfilePage() {
    const navigate = useNavigate()
    const { data: profileResponse, isLoading } = useGetCurrentUser()
    const profile = profileResponse?.data
    const updateProfileMutation = useUpdateCurrentUserMutation()

    const [showChangePassword, setShowChangePassword] = useState(false)

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    })

    // Reset form when profile data loads
    useEffect(() => {
        if (profile) {
            form.reset({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
            })
        }
    }, [profile, form])

    const onSubmit = async (data) => {
        updateProfileMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-destructive">Failed to load profile</p>
                        <Button onClick={() => navigate('/login')} className="w-full mt-4">
                            Back to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || 'U'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-4xl shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/20 pb-6">
                    <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
                    <CardDescription>Manage your personal information and security</CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
                        {/* Left Side - Avatar and Role */}
                        <div className="md:col-span-4 p-6 flex flex-col items-center border-r bg-muted/10">
                            <div className="relative mb-6">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt={profile.name} />
                                    <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                        {getInitials(profile.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <h2 className="text-xl font-bold text-center mb-1">{profile.name}</h2>
                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                                {profile.role || 'User'}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-6"
                                onClick={() => setShowChangePassword(true)}
                            >
                                Change Password
                            </Button>
                        </div>

                        {/* Right Side - Profile Form */}
                        <div className="md:col-span-8 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Profile Information</h3>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid gap-6">
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="John Doe"
                                                            disabled={updateProfileMutation.isPending}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            disabled={updateProfileMutation.isPending}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Phone Field */}
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="+1 (555) 000-0000"
                                                            disabled={updateProfileMutation.isPending}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                                            {updateProfileMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>

                <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="pt-4">
                            <ForgotPasswordPage
                                isModal={true}
                                onClose={() => setShowChangePassword(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

            </Card>
        </div>
    )
}
