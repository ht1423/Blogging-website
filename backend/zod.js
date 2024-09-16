const zod = require('zod')

const zodUserSignupSchema = zod.object({
    name: zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(8),
}).strict()

const zodUserSigninSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
}).strict()

const zodUserUpdateSchema = zodUserSignupSchema.extend({
    dateOfBirth: zod.string().pipe(zod.coerce.date()),
    profileImage: zod.string(),
    bio: zod.string(),
    blogs: zod.array(zod.string()),
    likedBlogs: zod.array(zod.string()),
    bookmarkedBlogs: zod.array(zod.string()),
    followers: zod.array(zod.string()),
    following: zod.array(zod.string()),
    role: zod.enum(['reader','writer','admin']),
}).partial().strict()

const zodBlogCreateSchema = zod.object({
    name: zod.string().min(1),
    description: zod.string().min(10),
}).strict()

const zodBlogUpdateSchema = zodBlogCreateSchema.partial().strict()

const zodCommentSchema = zod.object({
    comment: zod.string().min(1)
}).strict()

module.exports = {
    zodUserSignupSchema,
    zodUserSigninSchema,
    zodUserUpdateSchema,
    zodBlogCreateSchema,
    zodBlogUpdateSchema,
    zodCommentSchema
}

