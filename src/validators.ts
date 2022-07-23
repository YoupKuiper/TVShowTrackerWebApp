import { z } from "zod";

export type LoginResponse = z.infer<typeof LoginResponse>;

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

export type User = z.infer<typeof User>;
export type TvShowList = z.infer<typeof TvShowList>;
export type TvShow = z.infer<typeof TvShow>;
