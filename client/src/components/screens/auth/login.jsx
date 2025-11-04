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

function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		const payload = { email, password }
		// TODO: call your login API here
		await new Promise((r) => setTimeout(r, 700))
		console.log('login payload', payload)
		setLoading(false)
		toast.success('Signed in successfully')
	}

	return (
		<div className="min-h-screen h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
			<Card className="w-full max-w-md overflow-y-auto">
				<CardHeader>
					<CardTitle>Sign in to your account</CardTitle>
					<CardDescription>Enter your credentials to continue to the dashboard.</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit}>
            <div className="space-y-4">
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                />
              </div>

              <div className="flex items-center justify-end">
                <Button type="button" variant="link" className="text-sm px-0">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </div>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col gap-3">
					<div className="text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{' '}
						<Link to="/register" className="text-primary hover:underline">Register Here</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

export default LoginPage

