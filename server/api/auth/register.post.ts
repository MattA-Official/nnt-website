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
            // delete the user/login method from Firebase Auth
            await auth.deleteUser(decodedToken.uid).then(() => true).catch((error) => error.toJSON())

            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
                message: 'Email not provided'
            })
        }

        // Check if the user already exists in the database
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()
        let user: UserProfile

        if (!userDoc.exists) {
            const username = await generateUniqueSlug(db, decodedToken.name || decodedToken.email.split('@')[0])

            user = {
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
        } else {
            // User exists, convert timestamps
            user = convertTimestamps(userDoc.data() as UserProfile)
        }

        return {
            success: true,
            user,
            requiresSetup: !userDoc.exists
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Server Error',
            message: error.message || 'Authentication failed'
        })
    }
})