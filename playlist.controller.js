import mongoose from "mongoose";
import { Playlist } from "./src/models/playlist.model.js";
import { asyncHandler } from "./src/utils/asyncHandler.js"



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

})
const getUserPlaylist = asyncHandler(async (req, res) => {
    const { userId } = req.params

})
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.params

})
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

})
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

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
