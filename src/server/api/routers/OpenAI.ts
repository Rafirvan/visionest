import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
})


export const AIRouter = createTRPCRouter({

  idea: publicProcedure.input(z.object({
    major: z.string(),
    type: z.string(),
    field: z.string(),
    subject: z.string(),
    time: z.string(),
    constraint: z.string(),
  })).mutation(async ({ input }) => {
    const prompt =
      `You will help students find clever ideas for their next student project, given the list:
      student's major = ${input.major}
      student's preferred type of project(either practical or theoretical) = ${input.type}
      student's preferred field = ${input.field}
      student's subject of research or familiar technologies = ${input.subject}
      student's maximum time to complete the project(optional, ignore if empty) = ${input.time}
      what the student does not want for their project(optional, ignore if empty)= ${input.constraint}

      please return exactly one of this list following the exact format:
      Title of project recommendation=[your input here]
      Short description of the recommended project title=[your input here, max of 40 words]

      a couple more things to consider:
      -if any input fields are gibberish, ignore them
      -don't be afraid to recommend usage of a technology/subject adjacent to the ones they provide
      -if possible, try to lean to projects that may produce a scientific literature
      -please never use colon in place of equal sign
      `
    const ideaCompletion = await openai.chat.completions.create({
      messages: [{
        role: "user", content: prompt
      }],
      model: "gpt-3.5-turbo",
    });

    return ideaCompletion.choices[0]?.message.content

  }),

  content: publicProcedure.input(z.string().min(500)).mutation(async ({ input }) => {
    const prompt =
      `here, you are a content creator specializing in generating a blog-style text content 
      from a scientific paper's abstract, the content MUST contain 
      a minimum of 150 words and a maximum of 250 words
      given the list:
      scientific paper abstract = ${input}

      please return the following with the exact format:
      [your input here]

      a couple more things to consider:
      -make the content exciting while remaining grounded
      -avidly describe scientific terms that may be alien to most people
      -act like you are the creator of the paper, advertising your paper or product
      -if the scientific paper abstract input is gibberish,
      simply return the exact phrase "I am sorry, i cannot understand you"
      --if the scientific paper abstract input is less than 500 letters,
      simply return the exact phrase "minimum input is 500 letters"
      -do not return a title, also do not return a word count
      -end every output with "THIS POST IS AI-GENERATED" in a newline if possible

      `
    const contentCompletion = await openai.chat.completions.create({
      messages: [{
        role: "user", content: prompt
      }],
      model: "gpt-3.5-turbo",
    });
    return contentCompletion.choices[0]?.message.content
  }),
});
