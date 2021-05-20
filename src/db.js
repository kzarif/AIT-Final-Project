const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

let dbconf;
let USERNAME;
let PASSWORD
if(process.env.NODE_ENV === "development"){
    dbconf = 'mongodb://localhost/noteApp'
}
else if(process.env.NODE_ENV === "production"){
    USERNAME = process.env.USERNAME;
    PASSWORD = process.env.PASSWORD;    
    dbconf = `mongodb://${USERNAME}:${PASSWORD}@class-mongodb.cims.nyu.edu/USERNAME`
}

// add your schemas
const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    email: {type: String, required: true},
    taskLists: [{type: mongoose.Schema.Types.ObjectId, ref: 'TaskList'}]
});

const TaskListSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    listName: String,
    currentTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    completedTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
})

const TaskSchema =  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskList: {type: mongoose.Schema.Types.ObjectId, ref: "TaskList"},
    content: String,
    date: Date
})

UserSchema.plugin(passportLocalMongoose);

// register your model
mongoose.model('User', UserSchema);
mongoose.model('TaskList', TaskListSchema);
mongoose.model('Task', TaskSchema);
mongoose.connect(dbconf,  { useNewUrlParser: true });
