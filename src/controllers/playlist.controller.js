import  Playlist from '../models/playlist.model.js'
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const userId = req.user._id
    // Assuming `req.user` contains the authenticated user's details.
    if(!name){
        throw new ApiError(400, "Playlist name is required")
    }
    const playlist = await Playlist.create({name, description, owner : userId})
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));
});
// Get all playlists of a user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const playlists = await Playlist.find({userId})
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlists,
        }));
});
// Get a playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist =await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));

})
// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError("Playlist not found.", 404)
    }
    if(playlist.videos.includes(videoId)){
        throw new ApiError("Video already exists in playlist", 400)
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));
});
// remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError("Playlist not found.", 404)
    }
    const videoIndex = playlist.videos.indexOf(videoId)
    if(!videoIndex === -1){
        throw new ApiError("Video not found in the playlist.", 400)
    }
    playlist.videos.splice(videoIndex, 1)
    await playlist.save()
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));

})
// delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findByIdAndRemove(playlistId)
    if(!playlist){
        throw new ApiError("Playlist not found.", 404)
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));
});
// update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError("Playlist not found.", 404)
    }
    if(name) (playlist.name = name)
    if(description) (playlist.description = description)
    await playlist.save()
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: playlist,
        }));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
