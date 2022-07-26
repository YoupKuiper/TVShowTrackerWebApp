import { z } from "zod";

export const TvShowObject = z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string(),
    first_air_date: z.string()
})

export const UserObject = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    settings: z.object({
        emailAddressVerified: z.boolean(),
        wantsEmailNotifications: z.boolean()
      }).optional()
})

export const LoginResponseObject = z.object({
    token: z.string(),
    user: UserObject
});

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
export type TvShow = z.infer<typeof TvShowObject>;
export type IndexAndAlertMessage = z.infer<typeof IndexAndAlertMessageObject>;
