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
})

export const TVShowDetailsObject = z.object({
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
    details: z.object({
        adult: z.boolean(),
        backdrop_path: z.string(),
        created_by: z.array(
            z.object({
                id: z.number(),
                credit_id: z.string(),
                name: z.string(),
                gender: z.number(),
                profile_path: z.string()
            })
        ),
        episode_run_time: z.array(z.number()),
        first_air_date: z.string(),
        genres: z.array(z.object({ id: z.number(), name: z.string() })),
        homepage: z.string(),
        id: z.number(),
        in_production: z.boolean(),
        languages: z.array(z.string()),
        last_air_date: z.string(),
        last_episode_to_air: z.object({
            air_date: z.string(),
            episode_number: z.number(),
            id: z.number(),
            name: z.string(),
            overview: z.string(),
            production_code: z.string(),
            runtime: z.number(),
            season_number: z.number(),
            show_id: z.number(),
            still_path: z.string(),
            vote_average: z.number(),
            vote_count: z.number()
        }),
        name: z.string(),
        next_episode_to_air: z.object({
            air_date: z.string(),
            episode_number: z.number(),
            id: z.number(),
            name: z.string(),
            overview: z.string(),
            production_code: z.string(),
            runtime: z.number(),
            season_number: z.number(),
            show_id: z.number(),
            still_path: z.string(),
            vote_average: z.number(),
            vote_count: z.number()
        }),
        networks: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                logo_path: z.string(),
                origin_country: z.string()
            })
        ),
        number_of_episodes: z.number(),
        number_of_seasons: z.number(),
        origin_country: z.array(z.string()),
        original_language: z.string(),
        original_name: z.string(),
        overview: z.string(),
        popularity: z.number(),
        poster_path: z.string(),
        production_companies: z.array(
            z.union([
                z.object({
                    id: z.number(),
                    logo_path: z.string(),
                    name: z.string(),
                    origin_country: z.string()
                }),
                z.object({
                    id: z.number(),
                    logo_path: z.null(),
                    name: z.string(),
                    origin_country: z.string()
                })
            ])
        ),
        production_countries: z.array(
            z.object({ iso_3166_1: z.string(), name: z.string() })
        ),
        seasons: z.array(
            z.object({
                air_date: z.string(),
                episode_count: z.number(),
                id: z.number(),
                name: z.string(),
                overview: z.string(),
                poster_path: z.string(),
                season_number: z.number()
            })
        ),
        spoken_languages: z.array(
            z.object({
                english_name: z.string(),
                iso_639_1: z.string(),
                name: z.string()
            })
        ),
        status: z.string(),
        tagline: z.string(),
        type: z.string(),
        vote_average: z.number(),
        vote_count: z.number(),
        similar: z.object({
            page: z.number(),
            results: z.array(TVShowObject)
        })
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
export type SimpleTVShow = z.infer<typeof TVShowObject>;
export type TVShow = z.infer<typeof TVShowDetailsObject>;
export type IndexAndAlertMessage = z.infer<typeof IndexAndAlertMessageObject>;
