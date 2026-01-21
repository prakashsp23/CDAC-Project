import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useChangePasswordMutation } from '../../../query/queries'

// Password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(20, 'Password must not exceed 20 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine(val => !val.includes(' '), 'Password must not contain spaces')

// Change password schema
const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
export default function ForgotPasswordPage({ isModal = false, onClose = null }) {
  const [backendError, setBackendError] = useState("")

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const { mutate: changePassword, isPending } = useChangePasswordMutation()

  const onSubmit = (data) => {
    setBackendError("")

    changePassword(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          form.reset()
          if (isModal && onClose) onClose()
        },
        onError: (err) => {
          setBackendError(err?.message || "Failed to change password")
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {backendError && (
          <div className="text-sm text-destructive p-3 bg-destructive/10 rounded">
            {backendError}
          </div>
        )}

        {/* OLD PASSWORD */}
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NEW PASSWORD */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONFIRM PASSWORD */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BUTTONS */}
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Changing..." : "Change Password"}
          </Button>

          {isModal && onClose && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

ForgotPasswordPage.propTypes = {
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
}
