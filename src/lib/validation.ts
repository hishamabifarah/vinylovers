import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const newVinylSchema = z.object({
  artist: requiredString,
  album: requiredString,
  genreId: requiredString
});

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export const resetPasswordSchema = z.object({
  password: requiredString.min(8, "Must be at least 8 characters"),
  confirmPassword: requiredString.min(8, "Must be at least 8 characters"),
}) .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

export const resetPasswordEmailSchema = z.object({
  email: requiredString.email("Invalid email address")
})

export const loginSchema = z.object({
    username: requiredString,
    password: requiredString,
  });

// generate schemas to work with it in our frontend
export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ResetPassworEmaildValues = z.infer<typeof resetPasswordEmailSchema>;
export type NewVinylValues = z.infer<typeof newVinylSchema>;
