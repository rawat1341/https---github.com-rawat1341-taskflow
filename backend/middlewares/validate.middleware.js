export const validate = (schema) => async (req, res, next) => {
  try {
    const parseData = await schema.parseAsync(req.body);
    req.body = parseData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'validaton failed',
      error: error.issues[0],
    });
  }
};
