const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const externalService = require('../../services/external-service')
async function query(filterBy) {
    const criteria = {}
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     criteria.name = {$regex : regex}
    // }
    // if (filterBy.inStock === 'true') {
    //     // criteria.inStock = true
    // }
    // if (filterBy.labels) {
    //     console.log(JSON.stringify(filterBy.labels));
    //     criteria.labels =   { $all: [filterBy.labels.join(',')] } 
    //     // criteria.labels =   { $all: JSON.stringify(filterBy.labels) } 
    //     // criteria.labels =   { $all: JSON.stringify(filterBy.labels) } 
    // }
    try {
        const collection = await dbService.getCollection('task')
        if (filterBy.sort) {
            const sortBy = {}
            var tasks = await collection.find(criteria).sort(sortBy).toArray()
        }
        else {
            var tasks = await collection.find(criteria).toArray()
        }
        return tasks
    } catch (err) {
        logger.error('cannot find tasks', err)
        throw err
    }
}

async function getById(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        const task = collection.findOne({ _id: ObjectId(taskId) })
        return task
    } catch (err) {
        logger.error(`while finding task ${taskId}`, err)
        throw err
    }
}

async function remove(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(taskId) })
        return taskId
    } catch (err) {
        logger.error(`cannot remove task ${taskId}`, err)
        throw err
    }
}

async function add(task) {
    try {
        const collection = await dbService.getCollection('task')
        const addedTask = await collection.insertOne(task)
        return addedTask
    } catch (err) {
        logger.error('cannot insert task', err)
        throw err
    }
}
async function update(task) {
    try {
        var id = ObjectId(task._id)
        delete task._id
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: id }, { $set: { ...task } })
        return task
    } catch (err) {
        logger.error(`cannot update task ${taskId}`, err)
        throw err
    }
}

async function performTask(task) {
    const collection = await dbService.getCollection('task')
    try {
        task.status = 'running'
        await collection.updateOne({ _id: task._id }, { $set: { ...task } })
        await externalService.execute(task)
        task.status = 'success'
        task.doneAt = Date.now()
    } catch (error) {
        task.status = 'failed'
        task.errors.push(err)
    } finally {
        // TODO: update task lastTried, triesCount and save to DB
        task.lastTriedAt = Date.now()
        task.triesCount++
        await collection.updateOne({ _id: task._id }, { $set: { ...task } })
        return task
    }
}

async function getNextTask(){
    const collection = await dbService.getCollection('task')
    const task = collection.findOne({ status: 'failed'}, )
    if(task.triesCount > 5) task.status = 'error'
    return task
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    performTask,
    getNextTask
}