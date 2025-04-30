import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/index.js";
import { getJudge0LanguageId, submitBatch } from "../utils/judge0.js";

const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "you are not allow to create problem");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }
  }
  const submissions = testcases.map(({ input, output }) => ({
    source_code: solutionCode,
    language_id: languageId,
    stdin: input,
    expected_output: output,
  }));

  const submissionResults = await submitBatch(submissions);

  const tokens = submissionResults.map((res) => res.token);

  const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        
        if (result.status.id !== 3) {
            throw new ApiError(400,`Testcase ${i + 1} failed for language ${language}`)
          
        }
      }
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });
  
      return res
      .status(201)
      .json(new ApiResponse(201,newProblem,'Problem Created Successfully'))

});

const getAllProblems = asyncHandler(async (req, res) => {});

const getProblemById = asyncHandler(async (req, res) => {});

// TODO: IMPLEMENT BY YOUR SELF🔥
const updateProblem = asyncHandler(async (req, res) => {
  // id
  // id--->problem ( condition)
  // baaki kaam same as create
});

const deleteProblem = asyncHandler(async (req, res) => {});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
};
