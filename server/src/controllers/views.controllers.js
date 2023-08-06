import Product from '../models/Product.js';

const showProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const arrayProducts = products.map((product) => product.toObject());
    return res.render('products', {
      isLoggedIn: req.isAuthenticated(),
      user: req.session.user,
      arrayProducts,
    });
  } catch (error) {
    console.log(error);
  }

  res.render('products', {});
};

export { showProducts };
