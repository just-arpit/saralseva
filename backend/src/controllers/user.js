import User from '../models/User.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      occupation: req.body.occupation,
      annualIncome: req.body.annualIncome,
      education: req.body.education,
      maritalStatus: req.body.maritalStatus,
      language: req.body.language,
      notificationPreferences: req.body.notificationPreferences
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user bookmarks
 * @route   GET /api/users/bookmarks
 * @access  Private
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarkedSchemes');
    
    res.status(200).json({
      success: true,
      data: user.bookmarkedSchemes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add scheme to bookmarks
 * @route   POST /api/users/bookmarks/:schemeId
 * @access  Private
 */
export const addBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.bookmarkedSchemes.includes(req.params.schemeId)) {
      user.bookmarkedSchemes.push(req.params.schemeId);
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Scheme bookmarked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove scheme from bookmarks
 * @route   DELETE /api/users/bookmarks/:schemeId
 * @access  Private
 */
export const removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.bookmarkedSchemes = user.bookmarkedSchemes.filter(
      schemeId => !schemeId.equals(req.params.schemeId)
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
};