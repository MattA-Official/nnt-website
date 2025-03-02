// composables/useAuth.ts
import { ref } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import type { UserProfile } from '~/types'

export const useAuth = () => {
    const currentUser = useCurrentUser()
    const userProfile = ref<UserProfile | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const auth = useFirebaseAuth()!
    const requiresSetup = ref(false)

    const loginWithGoogle = async () => {
        isLoading.value = true
        error.value = null

        try {
            // Sign in with Google popup
            const provider = new GoogleAuthProvider()

            // Requested Scopes
            provider.addScope('profile')
            provider.addScope('email')

            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken()

            // Verify with server and ensure domain restriction
            const response = await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken }
            })

            // If successful, stay signed in
            return response
        } catch (err: any) {

            if (err.response?.status === 401) {
                error.value = 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.'
            } else {
                error.value = err.message || 'Authentication failed'
            }

            // Make sure user is signed out if the server rejected them
            await signOut(auth)

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        isLoading.value = true
        error.value = null

        try {
            // Sign in with email and password
            const result = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await result.user.getIdToken()

            // TODO: Get user profile from server
            // const response = await $fetch('/api/auth/login', {
            //     method: 'POST',
            //     body: { idToken }
            // })

            // If successful, stay signed in
            // return response
        } catch (err: any) {
            switch (err.code) {
                case 'auth/invalid-credential':
                    error.value = 'Invalid email or password';
                    break;
                case 'auth/too-many-requests':
                    error.value = 'Too many login attempts. Please try again later';
                    break;
                case 'auth/invalid-email':
                    error.value = 'Please enter a valid email address';
                    break;
                default:
                    error.value = 'Unable to sign in. Please try again';
            }

            // Make sure user is signed out if the server rejected them
            await signOut(auth)

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const register = async (email: string, password: string) => {
        isLoading.value = true
        error.value = null

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const idToken = await result.user.getIdToken()

            // Create user profile on server
            const response = await $fetch<{ success: boolean, user: UserProfile, requiresSetup: boolean }>('/api/auth/register', {
                method: 'POST',
                body: { idToken }
            })

            userProfile.value = response.user
            requiresSetup.value = response.requiresSetup

            return {
                user: response.user,
                requiresSetup: response.requiresSetup
            }
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    error.value = 'This email is already registered';
                    break;
                case 'auth/invalid-email':
                    error.value = 'Please enter a valid email address';
                    break;
                default:
                    error.value = 'Registration failed. Please try again';
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        isLoading.value = true
        error.value = null

        try {
            // Attempt to sign out
            await signOut(auth)
        } catch (err: any) {
            error.value = err.message || 'Logout failed'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const getProfile = async () => {
        if (!currentUser.value) return null

        isLoading.value = true
        error.value = null

        try {
            const idToken = await currentUser.value.getIdToken()
            const response = await $fetch<{ success: boolean, user: UserProfile }>('/api/auth/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            })

            userProfile.value = response.user
            return response.user
        } catch (err: any) {
            error.value = 'Failed to load profile'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateProfile = async (profileData: Partial<UserProfile>) => {
        if (!currentUser.value) return null

        isLoading.value = true
        error.value = null

        try {
            const idToken = await currentUser.value.getIdToken()
            const response = await $fetch<{ success: boolean, user: UserProfile }>('/api/auth/profile', {
                method: 'PUT',
                body: {
                    idToken,
                    profileData
                }
            })

            userProfile.value = response.user
            return response.user
        } catch (err: any) {
            error.value = 'Failed to update profile'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        currentUser,
        userProfile,
        isLoading,
        error,
        requiresSetup,
        loginWithEmail,
        loginWithGoogle,
        logout,
        register,
        getProfile,
        updateProfile
    }
}