import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { toast } from 'sonner'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      toast.error('Passwords do not match')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }

    setLoading(true)
    const payload = { name, email, password, phone }
    // TODO: call your registration API here
    await new Promise((r) => setTimeout(r, 800))
    console.log('register payload', payload)
    setLoading(false)
    toast.success('Registered successfully')
  }

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <Card className='w-full max-w-lg overflow-y-auto'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Register to access the dashboard and manage your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name and Email row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password fields */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  aria-invalid={passwordError ? "true" : undefined}
                />
                {passwordError && (
                  <span className="text-sm text-destructive">{passwordError}</span>
                )}
              </div>

              {/* Phone number */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Registering…' : 'Register'}
              </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage
