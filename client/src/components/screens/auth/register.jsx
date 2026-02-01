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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useRegisterMutation } from '../../../query/queries'

// Validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(1, ' Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .refine(val => !val.includes(' '), 'Password must not contain spaces'),
  confirmPassword: z.string(),
  phone: z.string().length(10, 'Phone number must be exactly 10 digits'),
  role: z.enum(['ADMIN', 'CUSTOMER', 'MECHANIC'], {
    required_error: 'Please select a role',
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function RegisterPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: undefined,
    },
  })
  const { mutate, isPending } = useRegisterMutation()

  const onSubmit = (data) => {
    // Remove confirmPassword from the data we send to the API
    const registrationData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    }
    mutate(registrationData)
  }

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <Card className='w-full max-w-lg overflow-y-auto'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Register to access the dashboard and manage your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name and Email row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password fields */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Choose a strong password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="MECHANIC">Mechanic</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isPending}
              >
                {isPending ? 'Registering…' : 'Register'}
              </Button>
            </form>
          </Form>
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
