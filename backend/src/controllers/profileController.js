// src/controllers/profileController.js
const profileService = require('../services/profileService');
const ApiResponse = require('../utils/ApiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

const createProfile = async (req, res, next) => {
  logger.debug('➜ [profileController] Creating profile');
  try {
    const { name, designation } = req.body;
    const file = req.file || null;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await profileService.createProfile({
      name,
      designation,
      file,
      uploadedBy: req.user.id,
      ipAddress
    });

    logger.debug(`✅ [profileController] Profile created. ID: ${result.id}`);
    res.status(201).json(ApiResponse.success('Profile created successfully', [result]));
  } catch (error) {
    next(error);
  }
};

const listProfiles = async (req, res, next) => {
  logger.debug('➜ [profileController] Listing profiles');
  try {
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset);
    const { profiles, total } = await profileService.listProfiles(limit, offset);

    res.json(ApiResponse.success('Profiles fetched successfully', profiles, {
      pagination: buildPaginationMeta(total, limit, offset, profiles.length)
    }));
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  logger.debug(`➜ [profileController] Fetching profile: ${req.params.id}`);
  try {
    const { id } = req.params;
    const profile = await profileService.getProfile(parseInt(id));
    res.json(ApiResponse.success('Profile fetched successfully', [profile]));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  logger.debug(`➜ [profileController] Updating profile: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { name, designation } = req.body;
    const file = req.file || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await profileService.updateProfile(
      parseInt(id),
      { name, designation, file },
      req.user.id,
      ipAddress
    );
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  logger.debug(`➜ [profileController] Deleting profile: ${req.params.id}`);
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await profileService.deleteProfile(parseInt(id), req.user.id, ipAddress);
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  listProfiles,
  getProfile,
  updateProfile,
  deleteProfile
};
