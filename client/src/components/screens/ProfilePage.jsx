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
    CardFooter,
} from '../ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getUserProfile } from '../../lib/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ForgotPasswordPage from '../screens/auth/ForgotPasswordPage'

// Validation schema
const profileSchema = z.object({
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required'),
})

export default function ProfilePage() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone: '',
            address: '',
        },
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            // const data = await getUserProfile()
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1 234-567-8900',
                address: '123 Main St, City, State',
                role: 'user',
            }
            setProfile(data)
            form.reset({
                phone: data?.phone || '',
                address: data?.address || '',
            })
        } catch (err) {
            console.error('Failed to fetch profile:', err)
            toast.error('Failed to load profile')
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        try {
            // TODO: Call API to update profile
            // await updateUserProfile(data)
            toast.success('Profile updated successfully')
            setIsEditing(false)
        } catch {
            toast.error('Failed to update profile')
        }
    }

    if (loading) {
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
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your profile information</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Side - Avatar and Name */}
                        <div className="flex flex-col items-center justify-start mt-4">
                            <Avatar className="h-28 w-28 mb-4">
                                <AvatarImage src="https://github.com/shadcn.png" alt={profile?.name} />
                                <AvatarFallback className="text-2xl">
                                    {getInitials(profile?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold text-center">{profile?.name}</h2>
                            <p className="text-sm text-muted-foreground capitalize mt-1">
                                {profile?.role || 'User'}
                            </p>
                        </div>

                        {/* Right Side - Profile Fields */}
                        <div className="md:col-span-2">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Email - Read Only */}
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <div className="flex items-center px-3 py-2 bg-muted rounded-md border border-input cursor-not-allowed">
                                            <span className="text-sm text-muted-foreground">{profile?.email}</span>
                                        </div>
                                    </FormItem>

                                    {/* Phone Number - Editable */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="(555) 123-567"
                                                        disabled={!isEditing}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Address - Editable */}
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="173 Oak Street, Apt 48, Greenfield, CA 90210"
                                                        disabled={!isEditing}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                                        <Button
                                            type="button"
                                            onClick={() => setShowChangePassword(true)}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Change Password
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (isEditing) {
                                                    form.handleSubmit(onSubmit)()
                                                } else {
                                                    setIsEditing(true)
                                                }
                                            }}
                                            className="flex-1"
                                        >
                                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>

                {showChangePassword && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowChangePassword(false)}
                    >
                        <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <ForgotPasswordPage
                                isModal={true}
                                onClose={() => setShowChangePassword(false)}
                            />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
