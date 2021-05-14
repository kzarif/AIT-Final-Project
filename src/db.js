const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

// add your schemas
const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    email: {type: String, required: true},
});

const TaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    listName: String,
    currentTasks: [String],
    completedTasks: [String],
})

UserSchema.plugin(passportLocalMongoose);

// register your model
mongoose.model('User', UserSchema);
mongoose.model('TaskList', TaskSchema);
mongoose.connect('mongodb://localhost/noteApp',  { useNewUrlParser: true });
