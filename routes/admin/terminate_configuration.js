"use strict";

const app = require("express").Router();
const SessionService = require("../../services/SessionService");
const db = require("../../models");

app.get("/admin/terminate_configuration", async function (req, res, next) {
  try {
      
    let configuration = await db.terminate_configuration.findAll({ attributes : ['id', 'message', 'header_text', 'counter']}); 
    return res.status(201).json({ success: true, data: configuration });
  } catch (error) {
    res.status(400).json({success : false, error :error.message})
  }
});

module.exports = app;
