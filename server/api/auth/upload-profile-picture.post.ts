import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth
    const storage = event.context.storage

    try {
        // Parse multipart form data
        const formData = await readMultipartFormData(event)

        if (!formData || formData.length === 0) {
            throw createError({
                statusCode: 400,
                message: 'No file uploaded'
            })
        }

        // Get the file from form data
        const file = formData.find(part => part.name === 'file')
        if (!file || !file.filename) {
            throw createError({
                statusCode: 400,
                message: 'Invalid file upload'
            })
        }

        // Verify token and get user ID
        const authHeader = getHeader(event, 'authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        const idToken = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        // Check file type (only allow images)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        const fileType = file.type || ''

        if (!allowedTypes.includes(fileType)) {
            throw createError({
                statusCode: 400,
                message: 'Only image files are allowed'
            })
        }

        // Get file extension
        const fileExtension = fileType.split('/')[1]

        // Generate a unique filename
        const filename = `${uid}-${randomUUID()}.${fileExtension}`
        const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET)
        console.log(`Uploading file to: ${bucket} profile-pictures/${filename}`)
        const fileRef = bucket.file(`profile-pictures/${filename}`)

        // Upload file to Firebase Storage
        await fileRef.save(file.data, {
            metadata: {
                contentType: fileType,
            }
        })

        // Get the public URL for the file
        await fileRef.makePublic()
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/profile-pictures/${filename}`

        return {
            success: true,
            url: publicUrl
        }

    } catch (error: any) {
        console.error(error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to upload profile picture'
        })
    }
})
