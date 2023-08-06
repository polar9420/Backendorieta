import { Router } from 'express';
import { showProducts } from '../controllers/views.controllers.js';
import { checkLogged, checkSession } from '../middlewares/auth.js';

// instancio mi router en este archivo
const router = Router();

router.get('/products', checkLogged, showProducts); //http://localhost:8080/views/products

router.get('/login', checkSession, (req, res) => {
	res.render('login');
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.get('/restore', (req, res) => {
	res.render('restore');
});

router.get('/', checkLogged, (req, res) => {
	res.render('profile', {
		user: req.session.user,
		isLoggedIn: req.isAuthenticated(),
	});
});

// se exporta con nombre "viewsRouter"
export default router;
