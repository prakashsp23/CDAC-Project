import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { validatePassword } from '../../../lib/password-validation'

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
  // Form field states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  // Password states
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [] })
  
  // UI states
  const [loading, setLoading] = useState(false)

  // Password validation handlers
  const validatePasswordStrength = (password) => {
    if (!password) {
      setPasswordValidation({ isValid: true, errors: [] })
      return
    }
    
    const { isValid, errors } = validatePassword(password, name, email)
    setPasswordValidation({ isValid, errors })
    return { isValid, errors }
  }

  const validatePasswordMatch = (currentPassword, confirmValue) => {
    if (!confirmValue) {
      setPasswordError('')
      return true
    }

    const doPasswordsMatch = currentPassword === confirmValue
    if (!doPasswordsMatch) {
      setPasswordError('Passwords do not match')
    } else {
      setPasswordError('')
    }
    return doPasswordsMatch
  }

  // Form handlers
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePasswordStrength(newPassword)
    validatePasswordMatch(newPassword, confirmPassword)
  }

  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value
    setConfirmPassword(confirmValue)
    validatePasswordMatch(password, confirmValue)
  }

  const validateForm = () => {
    const passwordsMatch = validatePasswordMatch(password, confirmPassword)
    if (!passwordsMatch) {
      toast.error('Passwords do not match')
      return false
    }

    const { isValid, errors } = validatePasswordStrength(password)
    if (!isValid) {
      toast.error(errors[0])
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    const payload = { name, email, password, phone }
    
    try {
      // TODO: call your registration API here
      await new Promise((r) => setTimeout(r, 800))
      console.log('register payload', payload)
      toast.success('Registered successfully')
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
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
                  onChange={handlePasswordChange}
                  placeholder="Choose a strong password"
                  aria-invalid={!passwordValidation.isValid}
                />
                {passwordValidation.errors.length > 0 && (
                  <ul className="text-sm text-destructive list-disc pl-4 mt-2">
                    {passwordValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
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
