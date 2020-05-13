const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'playlist_layout',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING
    },
    sequence_id: {
      type: Sequelize.STRING
    },
    group: {
      type: Sequelize.STRING
    },
    fadeIn: {
      type: Sequelize.INTEGER
    },
    fadeOut: {
      type: Sequelize.INTEGER
    },
    duration: {
      type: Sequelize.INTEGER
    },
    layout: {
      type: Sequelize.STRING
    },
    asset: {
      type: Sequelize.STRING
    },
    donorLevel: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING
    },
    quote: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)