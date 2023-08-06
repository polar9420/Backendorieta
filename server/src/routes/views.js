import {Router} from 'express';
import { showProducts } from '../controllers/views.controllers.js';

// instancio mi router en este archivo
const router = Router();

router.get('/products', showProducts); //http://localhost:8080/views/products

// se exporta con nombre "viewsRouter"
export default router;