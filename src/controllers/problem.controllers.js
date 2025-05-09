import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/index.js";
import { getJudge0LanguageId, submitBatch,pollBatchResults } from "../utils/judge0.js";

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
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`
        );
      }
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

const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();

    if (!problems) {
      throw new ApiError(404,"No problems Found")
      
    }

    return res
    .status(200)
    .json(new ApiResponse(200,problems,"problems Fetched Successfully"))
    
});

const getProblemById = asyncHandler(async (req, res) => {
  const {problemId} = req.params

  if(!problemId){
    throw new ApiError(400,"problemId required")
  }
  const problem = await db.problem.findUnique({
    where: {
      id:problemId,
    },
  });

  if (!problem) {
    throw new ApiError(404,"Problem not found.")
  }

  return res
  .status(200)
  .json(new ApiResponse(200,problem,"problem Fetched Successfully"))
  
});

// TODO: IMPLEMENT BY YOUR SELF🔥
const updateProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
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
    throw new ApiError(403, "You are not allowed to update problems");
  }

  const existingProblem = await db.problem.findUnique({ where: { id:problemId } });

  if (!existingProblem) {
    throw new ApiError(404, "Problem not found");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
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

      if (result.status.id !== 3) {
        throw new ApiError(400, `Testcase ${i + 1} failed for language ${language}`);
      }
    }
  }

  const updatedProblem = await db.problem.update({
    where: { id:problemId },
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
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProblem, "Problem updated successfully"));
});


const deleteProblem = asyncHandler(async (req, res) => {
  const {problemId} = req.params

  if(!problemId){
    throw new ApiError(400,"problemId required")
  }
  const problem = await db.problem.findUnique({
    where: {
      id:problemId,
    },
  });

  if (!problem) {
    throw new ApiError(404,"Problem not found.")
  }

  await db.problem.delete({ where: { id:problemId } });

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Problem deleted Successfully"))

    
});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {

  const problems = await db.problem.findMany({
    where:{
      ProblemSolved:{
        some:{
          userId:req.user.id
        }
      }
    },
    include:{
      ProblemSolved:{
        where:{
          userId:req.user.id
        }
      }
    }
  })

  return res
  .status(200)
  .json(new ApiResponse(200,problems,"Problems fetched successfully"))

});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
};
