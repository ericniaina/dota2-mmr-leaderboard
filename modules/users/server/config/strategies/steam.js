'use strict';

/**
 * Module dependencies
 */

var passport = require('passport'),
  users = require('../../controllers/users.server.controller'),
  SteamStrategy = require('passport-steam').Strategy,
  convertor = require('steam-id-convertor');


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
      lastName: providerData.realname,
      displayName: providerData.realname,
      email: '',
      username: convertor.to32(providerData.steamid),
      steamID32: convertor.to32(providerData.steamid),
      profileImageURL: providerData.avatar,
      provider: 'steam',
      providerIdentifierField: 'steamid',
      providerData: providerData
    };
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }
));
};
