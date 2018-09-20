const MongonClient = require('mongodb').MongoClient;
const assert = require('assert');

const config = require('setting');

module.exports = function () {
    //链接数据库

    MongonClient.connect(config.url,(err,client)=>{
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(config.db);
        //console.log("db::",db);
        insertDocuments(db,function () {
            findDocuments(db,function () {
                client.close();
            })
        })
    });
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//写入数据
const insertDocuments = (db,callback)=>{
    const collection = db.collection('documents');
    collection.insertMany([{a : 1}, {a : 2}, {a : 3}],function (err,result) {
        console.log(result.ops[0].a);
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    })

};

//查找数据
const findDocuments = (db,callback)=>{
    const collection = db.collection('documents');
    collection.find({}).toArray(function (err,result) {
        assert.equal(err,null);
        console.log('找到下面的数据:');
        console.log(result)

    })
};













