import {Router} from 'express'
import * as deptoControllers from '../controllers/deptos'
import isAuth from '../middleware/is-auth'
import * as reservationControllers from '../controllers/reservations'
import * as reviewControllers from '../controllers/reviews'

const router=Router()

router.get('/deptos',deptoControllers.getDeptos)

router.post('/create-depto',isAuth,deptoControllers.createDepto)

router.post('/search-deptos',deptoControllers.searchDeptos)

router.post('/reservation',reservationControllers.createReservation)

router.get('/details-depto/:deptoId',deptoControllers.getDepto)

router.post('/create-review',reviewControllers.createReview)

router.get('/getAllReviews/:deptoId',reviewControllers.getReviews)

export default router