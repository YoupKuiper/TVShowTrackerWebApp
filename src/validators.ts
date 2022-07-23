import { z } from "zod";

export const User = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }).default(''),
    emailAddressVerified: z.boolean().default(false),
    settings: z.object({
        wantsEmailNotifications: z.boolean().default(false),
        trackedTVShows: z.array(z.number()).default([])
      })
})

export type User = z.infer<typeof User>;

export const LoginResponse = z.object({
    token: z.string(),
    user: User
});

export type LoginResponse = z.infer<typeof LoginResponse>;

export const TvShow = z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string(),
    first_air_date: z.string()
})

export const TvShowList = z.array(TvShow)

export type TvShowList = z.infer<typeof TvShowList>;
export type TvShow = z.infer<typeof TvShow>;
