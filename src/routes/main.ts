import {Router} from 'express'
import * as deptoControlers from '../controllers/deptos'

const router=Router()

router.get('/deptos',deptoControlers.getDeptos)

router.post('/search-deptos',deptoControlers.searchDeptos)

export default router