import {z} from 'zod';

export const signUpSchema = z.object({
    email: z
        .string()
        .min(1 , {message: 'Email is Required'})
        .email({message: 'Please Enter A valid Email'}),
    password: z
        .string()
        .min(1 , {message: 'Password is Required' })
        .min(8 , {message: 'Password should be minimum of 8 character'}),
    passwordConfirmation: z
        .string()
        .min(1 , {message: 'Please Confirm Your Password'})
})
.refine((data) => data.password === data.passwordConfirmation , {
    message: 'Password do not Match',
    path: ['passwordConfirmation']
})