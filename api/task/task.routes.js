const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getTasks, getTaskById, addTask, updateTask, removeTask, addReview, performTask,runWorker,setWorker } = require('./task.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getTasks)
router.post('/start',setWorker,runWorker)
router.get('/:id', getTaskById)
router.get('/:id/start', performTask)
router.post('/',  addTask)
router.put('/:id',  updateTask)
router.delete('/:id',removeTask)

module.exports = router