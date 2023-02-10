export function validateSchema(schema) {

    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        let status = 422
        if(error.details[0].type === 'number.min') status = 400
        return res
          .status(status)
          .send(error.details.map((detail) => detail.message));
      }
  
      next();
    };
    
}