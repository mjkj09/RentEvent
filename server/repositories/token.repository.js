const Token = require('../models/token.model');

exports.findByToken = (token) =>
    Token.findOne({token}).exec();

exports.findByUserId = (userId) =>
    Token.find({userId}).exec();

exports.create = (data) =>
    new Token(data).save();

exports.remove = (token) =>
    Token.findOneAndDelete({token}).exec();

exports.removeAllUserTokens = (userId) =>
    Token.deleteMany({userId}).exec();