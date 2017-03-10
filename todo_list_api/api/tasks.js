const router = require('express').Router();
const r = require('rethinkdbdash')();
const _ = require('lodash');

router.get('/', (req,res) => {
    var params = req.query;
    
    r.db('todolist').table('tasks').filter(params).orderBy(r.desc('status')).run()
    .then(result => {
        console.log(result);
        res.send(result);
    })
});

router.post('/', (req,res) => {
    var params = req.body;

    r.db('todolist').table('tasks').insert(params).run()
    .then(result => {
        console.log(result);
        res.send(result);
    })
});

router.put('/', (req,res) => {
    var params = req.body;

    r.db('todolist').table('tasks').get(params.id)
    .update(params).run()
    .then(result => {
        res.send(result);
    })
});

router.delete('/', (req,res) => {
    var params = req.body;

    r.db('todolist').table('tasks').get(params.id)
    .delete().run()
    .then(result => {
        res.send(result);
    })
});

module.exports = router;