import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "message must be at least 10 character")
    .max(200, "message must not contains character"),
});
