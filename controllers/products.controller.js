let products = [
  {id: 1, name: "Hammer"},
  {id: 2, name: "Hammer2"},
];

module.exports.getAllProducts = (req, res, next) => {
  const { ip, query, params, body, headers } = req;

  console.log(ip, query, params, body, headers);

  res.download(__dirname + "/tools.controller.js");
  //   res.redirect('/login');
};

module.exports.getProductDetail = (req, res, next) => {
  const { id } = req.params;
  const foundProduct = products.find((product) => product.id === Number(id));
  res.status(200).send({
    success: true,
    message: 'SUccess',
    data: foundProduct
  });
  // res.status(500).send({
  //   success: false,
  //   error: 'Internal server error',

  // });
};

module.exports.saveAProducts = (req, res) => {
  res.send("products added");
};
