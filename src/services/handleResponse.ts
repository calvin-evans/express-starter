export default (payload, _, res, __) =>  {
  res.status(payload.success ? 200 : (payload?.error?.statusCode || 500)).send(payload)
}
