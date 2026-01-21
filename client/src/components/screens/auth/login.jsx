import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '../../ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { useLoginMutation } from '../../../query/queries'

// Validation schema
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // const { mutate, isPending } = useMutation({
  //   mutationFn: loginUser,
  //   onSuccess: (data) => {
  //     const role = data?.user?.role?.toUpperCase?.()
  //     dispatch(
  //       loginSuccess({
  //         user: { ...data.user, role },
  //         token: data.token,
  //       })
  //     )
  //     toast.success(data.message || 'Login successful')
  //     if (role === 'ADMIN') navigate('/admin')
  //     else if (role === 'CUSTOMER') navigate('/customers')
  //     else if (role === 'MECHANIC') navigate('/mechanic')
  //     else navigate('/')
  //   },
  //   onError: (err) => {
  //     toast.error(err?.message || 'Invalid credentials')
  //   },
  // })
  const { mutate, isPending } = useLoginMutation()

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <Card className="w-full max-w-md overflow-y-auto">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to continue to the dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
