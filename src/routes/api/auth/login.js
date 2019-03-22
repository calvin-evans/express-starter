import passport from 'passport'
import jwt from 'jsonwebtoken'

export default [
  {
    method: 'post',
    public: true,
    controller: [
      passport.authenticate('login'),
      (req, res) => {
        res.json({
          id: req.user._id,
          token: jwt.sign(req.user, process.env.JWT_SECRET || 'NOT_SECURE')
        })
      }
    ]
  }
]
