const zod = require('zod')

const zodUserSignupSchema = zod.object({
    name: zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(8),
})

const zodUserSigninSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
})

const zodUserUpdateSchema = zod.object({
    name: zod.string().min(1).optional(),
    email: zod.string().email().optional(),
    password: zod.string().min(8).optional(),
    dateOfBirth: zod.string().pipe(zod.coerce.date()).optional(),
    profileImage: zod.string().optional(),
    bio: zod.string().optional(),
    blogs: zod.array(zod.string()).optional(),
    likedBlogs: zod.array(zod.string()).optional(),
    bookmarkedBlogs: zod.array(zod.string()).optional(),
    followers: zod.array(zod.string()).optional(),
    following: zod.array(zod.string()).optional(),
    role: zod.enum(['reader','writer','admin']).optional(),
    isVerified: zod.boolean().optional()
})

module.exports = {
    zodUserSignupSchema,
    zodUserSigninSchema,
    zodUserUpdateSchema
}

