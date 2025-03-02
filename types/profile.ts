import { type BaseMetadata } from './index'

export type UserStatus = 'committee' | 'student' | 'alumni' | 'staff' | 'guest' | 'unknown'

export interface CommitteeInfo {
    role: string
}

export interface UserRoles {
    admin: boolean
    manager: boolean
    trainer: boolean
    committee: CommitteeInfo | false
}

export interface UserProfile {
    uid: string
    username: string
    displayName: string
    email: string
    status: UserStatus
    gradYear: number | null
    course?: string
    studentId?: string
    roles: UserRoles
    profile: {
        photoURL: string | null
        bio: string | null
        contactNumber: string | null
        socialLinks?: {
            facebook?: string
        }
        preferences?: {
            emailNotifications: boolean
            pushNotifications: boolean
            language: string
        }
    }
    metadata: Omit<BaseMetadata, 'createdBy'> & {
        lastLoginAt: Date
        verifiedAt?: Date
    }
}
