const express = require("express");
const productsControllers = require("../../controllers/products.controller");
const viewCount = require("../../middleware/viewCount");

const router = express.Router();

// Without shortcut
// router.get("/", (req, res) => {
//   res.send("products found with id");
// });

// router.post("/", (req, res) => {
//   res.send("products added");
// });

router
  .route("/")

  /**
   * @api {get} /products All products
   * @apiDescription Get all the products
   * @apiPermission admin
   *
   * @apiHeader {String} Auhtorization  User's access token
   *
   * @apiParam  {Number{1-}}    [page=1]    List page
   * @apiParam  {Number{1-100}} [limit=10]  Users per page
   *
   * @apiSuccess  {Object[]} all the products
   *
   * @apiError  {Unauthorized 401}  Unauthorized  Only authorized users can access the data
   * @apiError  {Forbidden 403}  Forbidden  Only admin can access the data
   */
  .get(productsControllers.getAllProducts)

  /**
   * @api {post} /products save a products
   * @apiDescription Get all the products
   * @apiPermission admin
   *
   * @apiHeader {String} Auhtorization  User's access token
   *
   * @apiParam  {Number{1-}}    [page=1]    List page
   * @apiParam  {Number{1-100}} [limit=10]  Users per page
   *
   * @apiSuccess  {Object[]} all the products
   *
   * @apiError  {Unauthorized 401}  Unauthorized  Only authorized users can access the data
   * @apiError  {Forbidden 403}  Forbidden  Only admin can access the data
   */
  .post(productsControllers.saveAProducts);

router.route("/:id").get(viewCount, productsControllers.getProductDetail);

module.exports = router;
