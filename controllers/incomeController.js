const models = require('../models/incomeModels')

exports.income = async (req, res) => {
    try{
        const income = await models.find();
        res.status(200).json(income);
    } catch(error){
        res.status(500).json(error.message)
    }
}

exports.find = async (req, res) => {
    try{
        const check = await models.find({username: req.params.source});
        res.status(200).json(check);
    } catch(error){
        res.status(500).json(error.message)
    }
}

exports.new = async (req, res) => {
    const { source, amount, createdAt, userID} = req.body
    try{
        const newIncome = models({
            source,
            amount,
            createdAt,
            userID
        })
        const find = await models.find({$and: [{source: source}, {userID: userID}]})
        if(find.ok){
            res.status(404).json({error: "source is already existed"});
        }
        const save = await newIncome.save()
        res.status(200).json(save)
    }catch(error){
        res.status(500).json(error.message)
    }
}

exports.update = async (req, res) => {
    const { source, userID} = req.body
    try{
        const find = await models.find({$and: [{source: source}, {userID: userID}]})
        if(!find.ok){
            res.status(404).json({error: "source not found"});
        }
        const update = await models.updateOne({userID: userID},{$set: {source: source}})
        res.status(200).json(update)
    }catch(error){
        res.status(500).json(error.message)
    }
}

exports.delete = async (req, res) => {
    const {source} = req.body;
    try{
        const findID = await models.find(req.params.userID);
        if(!findID.ok){
            res.status(404).json({error: 'source not found'})
        }
        const deletes = await Cate.deleteOne({source: source})
        res.status(200).json(deletes)
    } catch(error){
        res.status(500).json(error.message)
    }
}