import { z } from "zod";

export const TvShow = z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string(),
    first_air_date: z.string()
})

export const TvShowList = z.array(TvShow)

export const User = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    emailAddressVerified: z.boolean(),
    settings: z.object({
        wantsEmailNotifications: z.boolean(),
        trackedTVShows: TvShowList
      })
})

export const LoginResponse = z.object({
    token: z.string(),
    user: User
});

export const UserAccountCreation = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    repeatedPassword: z.string()
}).refine((data) => data.password === data.repeatedPassword, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
})

export const IndexAndAlertMessage = z.object({
    index: z.number(),
    message: z.string()
})

export type User = z.infer<typeof User>;
export type LoginResponse = z.infer<typeof LoginResponse>;
export type TvShowList = z.infer<typeof TvShowList>;
export type TvShow = z.infer<typeof TvShow>;
export type IndexAndAlertMessage = z.infer<typeof IndexAndAlertMessage>;
