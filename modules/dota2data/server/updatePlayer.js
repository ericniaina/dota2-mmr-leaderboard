'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  request = require('request'),
  PlayerInfoSchema = mongoose.model('PlayerInfoSchema');;

var playerStats = function (playerID, apiKey) {
  var apiBase = 'https://api.opendota.com/api/players/' + playerID;

  var playerInfoJson = new PlayerInfoSchema();
  return new Promise(function (resolve, reject) {
    request(apiBase, function (err, res) {
      if (err) {
        playerInfoJson.status = 'Error';
        reject('error with initial request');
      } else {
        const data = JSON.parse(res.body);
        if (data.error) {
          playerInfoJson.status = 'Invalid';
          resolve(playerInfoJson);
        } else {
          playerInfoJson.status = 'Valid Account';
          playerInfoJson.soloMMR = data.solo_competitive_rank;
          playerInfoJson.partyMMR = data.competitive_rank;
          playerInfoJson.estMMR = data.mmr_estimate.estimate;
          request(apiBase + '/wl', function (err, res) {
            if (err) {
              playerInfoJson.status = 'Error';
              reject('error with wl request');
            }
            const data = JSON.parse(res.body);
            if (data.lose == null || data.win == null) {
              reject('error fetching win loss data');
            }
            playerInfoJson.winLoss.losses = data.lose;
            playerInfoJson.winLoss.wins = data.win;
            playerInfoJson.winLoss.totalGames = data.lose + data.win;
            playerInfoJson.winLoss.winrate = (data.win / (data.lose + data.win));
            resolve(playerInfoJson);
          });
        }
      }
    });
  });
};

exports.updatePlayer = function (playerID) {
  var promisedData = playerStats(playerID, config.steam.apiKey);
  // Update MMR and stats
  promisedData.then(function(playerInfoJson) {
    User.update({ steamID32: playerID }, { $set: { dotaStats: playerInfoJson } }, function () {
    });
  });

  // Update Matches
};
