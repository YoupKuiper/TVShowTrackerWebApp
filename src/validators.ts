import { z } from "zod";

export const TVShowObject = z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string(),
    genre_ids: z.array(z.number()),
    origin_country: z.array(z.string()),
    original_language: z.string(),
    original_name: z.string(),
    popularity: z.number(),
    first_air_date: z.string(),
    overview: z.string(),
    backdrop_path: z.string(),
    vote_average: z.number(),
    vote_count: z.number(),
    network: z.object({
        logo_path: z.string(),
        name: z.string(),
        id: z.number(),
        origin_country: z.string()
    }).optional()
})

export const UserObject = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    wantsEmailNotifications: z.boolean()
})

export const LoginResponseObject = z.object({
    token: z.string(),
    user: UserObject
});

export const LoginUserObject = z.object({
    emailAddress: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Please enter a password' })
})

export const PasswordResetEmail = z.string().email({ message: 'Invalid email address' })

export const PasswordResetObject = z.object({
    newPassword: z.string(),
    repeatedPassword: z.string()
}).refine((data) => data.newPassword === data.repeatedPassword, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
})

export const UserAccountCreation = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    repeatedPassword: z.string()
}).refine((data) => data.password === data.repeatedPassword, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
})

export const IndexAndAlertMessageObject = z.object({
    index: z.number(),
    message: z.string()
})

export type User = z.infer<typeof UserObject>;
export type LoginResponse = z.infer<typeof LoginResponseObject>;
export type TVShow = z.infer<typeof TVShowObject>;
export type IndexAndAlertMessage = z.infer<typeof IndexAndAlertMessageObject>;
