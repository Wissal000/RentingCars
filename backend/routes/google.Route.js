import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Step 1 - Redirect to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2 - Callback from Google
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Make sure this matches your frontend route
    res.redirect(`${process.env.BASE_URL}/login?token=${token}`);
  }
);


export default router;
