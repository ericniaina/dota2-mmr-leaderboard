'use strict';

/**
 * Module dependencies
 */

var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  users = require('../../controllers/users.server.controller'),
  session = require('express-session'),
  SteamStrategy = require('passport-steam').Strategy;


module.exports = function (config) {
  passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/api/auth/steam/callback',
    realm: 'http://localhost:3000/',
    apiKey: '446CC5B77CC11047AD3CAAB3C4F1ACD4',
    passReqToCallback: true
  },
  function(req, identifier, profile, done) {
    var providerData = profile._json;
    var providerUserProfile = {
      firstName: providerData.realname,
      lastName: 'profile.name.familyName',
      displayName: providerData.realname,
      email: 'ericniaina@msn.com',
      username: 'profile.username',
      profileImageURL: providerData.avatar,
      provider: 'steam',
      providerIdentifierField: 'steamid',
      providerData: providerData
    };
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }
));
};
