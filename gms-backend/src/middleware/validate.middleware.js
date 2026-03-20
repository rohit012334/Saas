export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })

  if (error) {
    const errors = error.detail.map((d) => ({
      field: d.path[0],
      message: d.message,
    }))
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    })
  }

  next()
}
