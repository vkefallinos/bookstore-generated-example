import express from "express"
const router = express.Router()

router
  .route("Book/$id")

  .DELETE()

// router.param('shopId', shopCtrl.shopByID)
// router.param('userId', userCtrl.userByID)

export default router
