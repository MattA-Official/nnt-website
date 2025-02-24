import generateUniqueSlug from "~/server/utils/slug"
import { UserProfile } from "~/types"

export default defineEventHandler(async (event) => {
    const auth = event.context.auth
    const db = event.context.db

    try {
        const { idToken } = await readBody(event)

        // Verify the Firebase token directly
        const decodedToken = await auth.verifyIdToken(idToken)

        // Check the email exists
        if (!decodedToken.email) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'Email not provided'
            })
        }

        // TODO: Create the user in the database if they don't exist
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()

        if (!userDoc.exists) {
            const username = await generateUniqueSlug(db, decodedToken.name || decodedToken.email.split('@')[0])

            const user: UserProfile = {
                uid: decodedToken.uid,
                username: username,
                displayName: decodedToken.name || decodedToken.email.split('@')[0],
                email: decodedToken.email,
                status: 'unknown',
                gradYear: null,
                roles: {
                    admin: false,
                    manager: false,
                    trainer: false,
                    committee: false
                },
                profile: {
                    photoURL: null,
                    bio: null,
                    contactNumber: null,
                    preferences: {
                        emailNotifications: false,
                        pushNotifications: false,
                        language: 'en'
                    }
                },
                metadata: {
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                    isActive: true
                }
            }


            await db.collection('users').doc(decodedToken.uid).set(user)
        }

        // Return the user and session token
        const user: UserProfile = convertTimestamps(userDoc.data() as UserProfile)

        return {
            success: true,
            user
        }
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: error.statusMessage || 'Unauthorized',
            message: error.message || 'Authentication failed'
        })
    }
})