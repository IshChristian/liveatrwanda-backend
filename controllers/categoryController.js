const Cate = require('../models/categoryModels');

exports.category = async (req,res) => {
    try{
        const cates = await Cate.find()
        res.status(200).json(cates)
    } catch(error){
        res.status(500).json(error.message)
    }
}

exports.find = async (req, res) => {
    try{
        const cates = await Cate.find({name: req.params.name});
        if(cates.ok){
            res.status(404).json({error: "category not found"});
        }
        res.status(200).json(cates);
    } catch(error){
        res.status(500).json(error.message);
    }
}

exports.new = async (req,res) => {
    const { name, createdAt, userID, username} = req.body
    try{
        const catesNew = Cate({
            name,
            createdAt,
            userID,
            username
        })
        const find = await Cate.find({name: name, userID: userID});
        if(find.ok){
            res.status(404).json({error: "Category is already existed"})
        }
        const news = await catesNew.save()
        res.status(200).json(news)
    } catch(error){
        res.status(500).json(error.message)
    }
}

exports.update = async (req,res) => {
    const {name, userID} = req.body;
    try{
        const update = Cate.updateOne({userID: userID}, {$set: {name: name}});
        res.status(200).json(update)
    } catch(error){
        res.status(500).json(error.message)
    }
}

exports.delete = async (req, res) => {
    const {name} = req.body;
    try{
        const findID = await Cate.find(req.params.userID);
        if(!findID.ok){
            res.status(404).json({error: 'category not found'})
        }
        const deletes = await Cate.deleteOne({name: name})
        res.status(200).json(deletes)
    } catch(error){
        res.status(500).json(error.message)
    }
}