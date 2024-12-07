import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must contains 2 character")
  .max(20, "username must not contains more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contains special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must contains 6 characters" }),
});
