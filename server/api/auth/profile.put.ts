import { UserProfile } from "~/types"

export default defineEventHandler(async (event) => {
    const auth = event.context.auth
    const db = event.context.db

    try {
        const { profileData, idToken } = await readBody(event)

        // Verify the Firebase token
        const decodedToken = await auth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        // Get the current user profile
        const userDoc = await db.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'User profile not found'
            })
        }

        const currentUser = userDoc.data() as UserProfile

        // Validate and sanitize profile data
        const updatedData = {
            displayName: profileData.displayName || currentUser.displayName,
            username: profileData.username || currentUser.username,
            status: profileData.status || currentUser.status,
            gradYear: profileData.gradYear || currentUser.gradYear,
            profile: {
                ...currentUser.profile,
                bio: profileData.bio ?? currentUser.profile.bio,
                photoURL: profileData.photoURL ?? currentUser.profile.photoURL,
                contactNumber: profileData.contactNumber ?? currentUser.profile.contactNumber,
            },
            metadata: {
                ...currentUser.metadata,
                updatedAt: new Date()
            }
        }

        // Update the user profile
        await db.collection('users').doc(uid).update(updatedData)

        // Get the updated user data
        const updatedUserDoc = await db.collection('users').doc(uid).get()
        const updatedUser = convertTimestamps(updatedUserDoc.data() as UserProfile)

        return {
            success: true,
            user: updatedUser
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Server Error',
            message: error.message || 'Failed to update profile'
        })
    }
})
