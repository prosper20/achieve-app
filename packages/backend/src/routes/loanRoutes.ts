import express from 'express';
import { getAllLoans, getLoansByStatus, getUserLoans, getExpiredLoans, deleteLoan } from '../controllers/loanController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllLoans);
router.route('/status').get(getLoansByStatus);
router.route('/expired').get(getExpiredLoans);
router.route('/:userEmail/get').get(getUserLoans);

router.route('/:loanId/delete').delete(restrictTo('superAdmin'), deleteLoan);

export default router;
