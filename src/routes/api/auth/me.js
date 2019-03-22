export default [
  {
    method: 'get',
    controller(req, res) {
      res.json(req.user)
    }
  }
]
