"use strict";

const app = require("express").Router();
const Sequelize = require("sequelize");
const logger = require("../../services/LoggingService");
let pagination = require("../../services/PaginationService");
let SessionService = require("../../services/SessionService");
let JwtService = require("../../services/JwtService");

const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get("/admin/terminate_configuration/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    try {
      let session = req.session;
      let paginateListViewModel = require("../../view_models/terminated_configuration_view_model");
  
      var viewModel = new paginateListViewModel(db.terminate_configuration, "Terminate Configuration", session.success, session.error, "/admin/terminate_configuration");
  
      const format = req.query.format ? req.query.format : "view";
      const direction = req.query.direction ? req.query.direction : "ASC";
      const per_page = req.query.per_page ? req.query.per_page : 10;
      // let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
      let order_by = [
        ["id", direction],
      ];
      // Check for flash messages
      const flashMessageSuccess = req.flash("success");
      if (flashMessageSuccess && flashMessageSuccess.length > 0) {
        viewModel.success = flashMessageSuccess[0];
      }
      const flashMessageError = req.flash("error");
      if (flashMessageError && flashMessageError.length > 0) {
        viewModel.error = flashMessageError[0];
      }
  
      viewModel.set_id(req.query.id ? req.query.id : "1");
  
      let where = helpers.filterEmptyFields({
        id: viewModel.get_id(), 
      });
  
      const count = await db.terminate_configuration._count(where, [{ all: true, nested: true }]);
  
      viewModel.set_total_rows(count);
      viewModel.set_per_page(+per_page);
      viewModel.set_page(+req.params.num);
      viewModel.set_query(req.query);
      viewModel.set_sort_base_url(`/admin/terminate_configuration/${+req.params.num}`);
      viewModel.set_sort(direction);
  
      const list = await db.terminate_configuration.getPaginatedV2(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, [{ all: true, nested: true }]);
  
      viewModel.set_list(list);
  
      if (format == "csv") {
        const csv = viewModel.to_csv();
        return res
          .set({
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="export.csv"',
          })
          .send(csv);
      }
  
      return res.render("admin/Terminate_configuration", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Terminate_configuration", viewModel);
    }
  });

app.get("/admin/terminate_configuration-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const terminateConfigurationAdminEditViewModel = require("../../view_models/terminated_configuration_edit_view_model");
  
    const viewModel = new terminateConfigurationAdminEditViewModel(db.terminate_configuration, "Edit Terminated Configuration", "", "", "/admin/terminate_configuration");
  
    try {
      const exists = await db.terminate_configuration.getByPK(id);
  
      if (!exists) {
        req.flash("error", "Active not found");
        return res.redirect("/admin/actives/0");
      }
      const values = exists;
      Object.keys(viewModel.form_fields).forEach((field) => {
        viewModel.form_fields[field] = values[field] || "";
      });
    
      return res.render("admin/Edit_Terminate_Configuration", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Edit_Terminate_Configuration", viewModel);
    }
  });

app.post("/admin/terminate_configuration-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const terminateConfigurationAdminEditViewModel = require("../../view_models/terminated_configuration_edit_view_model");

  const viewModel = new terminateConfigurationAdminEditViewModel(db.terminate_configuration, "Edit Terminated Configuration", "", "", "/admin/terminate_configuration");
  viewModel.form_fields = { variables_scores: "", name: "", id: "" };
  viewModel.output_variables = await db.output_variable.getAll();
  const { message, header_text, counter } = req.body;

  viewModel.form_fields = {
    message, header_text, counter
  };

  delete viewModel.form_fields.id;

  try {
   

    const resourceExists = await db.terminate_configuration.getByPK(id);
    if (!resourceExists) {
      req.flash("error", "Terminate Configuration not found");
      return res.redirect("/admin/terminate_configuration/0");
    }

    viewModel.session = req.session;

    let data = await db.terminate_configuration.update( req.body , {
      where: {
        id
      }
    });
    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Edit_Terminate_Configuration", viewModel);
    }

    req.flash("success", "Terminate Configuration edited successfully");

    return res.redirect("/admin/terminate_configuration/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Terminate_Configuration", viewModel);
  }
  });

module.exports = app;
