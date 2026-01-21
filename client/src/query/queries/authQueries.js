import { useMutation } from '@tanstack/react-query'
import { AuthApi } from '../../services/apiService'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../slices/authSlice'
import { toast } from 'sonner'

// Login mutation
export function useLoginMutation() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: AuthApi.login,
        onSuccess: (data) => {
            const role = data?.user?.role?.toUpperCase?.()
            dispatch(
                loginSuccess({
                    user: { ...data.user, role },
                    token: data.token,
                })
            )
            toast.success(data.message || 'Login successful')
            if (role === 'ADMIN') navigate('/admin')
            else if (role === 'CUSTOMER') navigate('/customers')
            else if (role === 'MECHANIC') navigate('/mechanic')
            else navigate('/')
        },
        onError: (err) => {
            toast.error(err?.message || 'Invalid credentials')
        },
    })
}

// Register mutation
export function useRegisterMutation() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: AuthApi.register,
        onSuccess: (data) => {
            console.log("register success", data)

            // If backend returns token and user, dispatch loginSuccess
            if (data?.token && data?.user) {
                dispatch(
                    loginSuccess({
                        user: data.user,
                        token: data.token,
                    })
                )

                toast.success(data.message || 'Registration successful!')

                const role = data.user.role.toUpperCase()
                if (role === 'ADMIN') navigate('/admin')
                else if (role === 'CUSTOMER') navigate('/customers')
                else if (role === 'MECHANIC') navigate('/mechanic')
                else navigate('/')
            } else {
                // Backend only returns message, redirect to login
                toast.success(data.message || 'Registration successful! Please login.')
                navigate('/login')
            }
        },
        onError: (err) => {
            console.error('Registration failed:', err)
            toast.error(err?.message || 'Registration failed. Please try again.')

            if (err?.message?.toLowerCase().includes('email')) {
                // form.setFocus('email')
            }
        },
    })
}

// Change password mutation
export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: AuthApi.changePassword,
        onSuccess: (data) => {
            toast.success(data?.message || 'Password changed successfully')
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to change password')
        },
    })
}
