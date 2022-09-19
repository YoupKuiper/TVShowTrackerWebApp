import { z } from "zod";

export const TVShowObject = z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string(),
    first_air_date: z.string(),
    overview: z.string(),
    backdrop_path: z.string(),
    vote_average: z.number(),
    vote_count: z.number()
})

export const UserObject = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    settings: z.object({
        wantsEmailNotifications: z.boolean()
      })
})

export const LoginResponseObject = z.object({
    token: z.string(),
    user: UserObject
});

export const LoginUserObject = z.object({
    emailAddress: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Please enter a password' })
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
