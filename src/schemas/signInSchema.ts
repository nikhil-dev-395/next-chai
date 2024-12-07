import { z } from "zod";

export const signInSchema = z.object({
  identifier:
    z.string() /*identifier means email or username which will help us to get sign in the user*/,
  password: z.string(),
});
