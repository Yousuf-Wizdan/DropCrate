import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1 , {message: 'Email is Required'})
        .email({message: 'Please Enter A valid Email'}),
    password: z
        .string()
        .min(1 , {message: 'Password is Required' })
        .min(8 , {message: 'Password should be minimum of 8 character'})
})