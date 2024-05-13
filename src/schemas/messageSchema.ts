import {z} from 'zod'

export const messageSchema = z.object({
    content : z.string()
    .min(10, {message : "Content should have atleast 10 characters"})
    .max(300, {message : "Content should be no longer than 300 characters"})
}) 