const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'playlist',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playlist_key: {
      type: Sequelize.STRING
    },
    placement: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.STRING
    },
    startDate: {
      type: Sequelize.STRING
    },
    endDate: {
      type: Sequelize.STRING
    },
    startTime: {
      type: Sequelize.STRING
    },
    endTime: {
      type: Sequelize.STRING
    },
    playOrder: {
      type: Sequelize.INTEGER
    },
    duration: {
      type: Sequelize.INTEGER
    },
    transDuration: {
      type: Sequelize.INTEGER
    },
    fadeIn: {
      type: Sequelize.INTEGER
    },
    fadeOut: {
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.STRING
    },
    asset: {
      type: Sequelize.STRING
    },
    idp: {
      type: Sequelize.STRING
    },
    layout: {
      type: Sequelize.STRING
    },
    bgMovie: {
      type: Sequelize.STRING
    },
    solo: {
      type: Sequelize.STRING
    },
    num_list_items: {
      type: Sequelize.INTEGER
    },
    active: {
      type: Sequelize.STRING
    },
    playListLayoutIdsStr: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)
