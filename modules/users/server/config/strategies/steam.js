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
    returnURL: config.steam.returnURL,
    realm: config.steam.realm,
    apiKey: config.steam.apiKey,
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
