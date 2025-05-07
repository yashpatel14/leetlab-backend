import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

const getSubmissionsForProblem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(400, "userId required");
  }
  const problemId = req.params.problemId;
  if (!problemId) {
    throw new ApiError(400, "problemId required");
  }

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submissions, "Submission fetched successfully"));
});

const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.problemId;
  if (!problemId) {
    throw new ApiError(400, "problemId required");
  }
  const submission = await db.submission.count({
    where: {
      problemId: problemId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submission, "Submissions Fetched successfully"));
});

export {
  getAllSubmission,
  getSubmissionsForProblem,
  getAllTheSubmissionsForProblem,
};
