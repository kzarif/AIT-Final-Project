const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, unique: true, required: true},
});

// register your model
mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/noteApp');
