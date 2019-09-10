import { verify } from "jsonwebtoken"
function validateJWT(authorization, secret) {
  let decoded = false
  try {
    if (authorization) {
      const parts = authorization.split(" ")
      if (parts.length == 2) {
        const scheme = parts[0]
        const token = parts[1]
        if (/^Bearer$/i.test(scheme)) {
          if (token) {
            decoded = verify(token, secret)
            return decoded
          }
        }
      }
    }
  } catch (err) {
    return new UnauthorizedError("credentials_bad_format", {
      message: "Format is Authorization: Bearer [token]"
    })
  }
  return new UnauthorizedError("invalid_token", {
    message: "Format is Authorization: Bearer [token]"
  })
}
