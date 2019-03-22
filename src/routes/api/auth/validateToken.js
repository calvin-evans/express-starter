export default [
  {
    method: 'get',
    controller(req, res) {
      res.status(200).json({ valid: true })
    }
  }
]
