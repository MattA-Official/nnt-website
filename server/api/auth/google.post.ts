export default defineEventHandler(async (event) => {
    try {
        const { idToken } = await readBody(event)

        // Verify the Firebase token directly
        const decodedToken = await event.context.auth.verifyIdToken(idToken)

        // Check if email ends with @newtheatre.org.uk
        if (!decodedToken.email?.endsWith('@newtheatre.org.uk')) {
            // delete the user/login method from Firebase Auth
            const result = await event.context.auth.deleteUser(decodedToken.uid).then(() => true).catch((error) => error.toJSON())

            console.log('Deleted user:', result)

            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.',
                message: 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.'
            })
        }

        // Generate session token using admin SDK
        const sessionToken = await event.context.auth.createCustomToken(decodedToken.uid)

        // TODO: Create the user in the database if they don't exist

        return {
            success: true,
            user: decodedToken,
            sessionToken
        }
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: error.statusMessage || 'Unauthorized',
            message: error.message || 'Authentication failed'
        })
    }
})