import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "name and description are required");
  }

  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(400, "userId required");
  }

  const playList = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist created successfully"));
});

const getAllListDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playListId } = req.params;

  if (!playListId) {
    throw new ApiError(400, "playListId required");
  }

  const playlist = await db.playlist.findUnique({
    where: {
      id: playListId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!playListId) {
    throw new ApiError(400, "playlistId is required");
  }
  const { problemIds } = req.body;
  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemsId");
  }

  // Create records fro each problems in the playlist
  const problemsInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playListId,
      problemId,
    })),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        problemsInPlaylist,
        "Problems added to playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playListId } = req.params;

  if (!playListId) {
    throw new ApiError(400, "playListId is required");
  }

  const deletedPlaylist = await db.playlist.delete({
    where: {
      id: playListId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!playListId) {
    throw new ApiError(400, "playListId is required");
  }
  const { problemIds } = req.body;
  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemsId");
  }

  const deletedProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playListId,
      problemId: {
        in: problemIds,
      },
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedProblem,
        "Problem removed from playlist successfully"
      )
    );
});

export {
  createPlaylist,
  getAllListDetails,
  getPlayListDetails,
  addProblemToPlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
};
