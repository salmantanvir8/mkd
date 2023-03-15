/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * sms Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { intersection } = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
    const Terminate_configuration = sequelize.define(
        "terminate_configuration",
        {
          id: {
            type: DataTypes.INTEGER,
             primaryKey: true,
            
            autoIncrement: true,
          },
          message: DataTypes.STRING,
          header_text :  DataTypes.STRING,
          counter: DataTypes.INTEGER,
          created_at: DataTypes.DATEONLY,
          updated_at: DataTypes.DATE,
        },
        {
          timestamps: true,
          freezeTableName: true,
          tableName: "terminate_configuration",
        },
        {
          underscoredAll: false,
          underscored: false,
        }
      );
      coreModel.call(this, Terminate_configuration);

      Terminate_configuration._preCreateProcessing = function (data) {
        return data;
      };
      Terminate_configuration._postCreateProcessing = function (data) {
        return data;
      };
      Terminate_configuration._customCountingConditions = function (data) {
        return data;
      };
    
      Terminate_configuration._filterAllowKeys = function (data) {
        let cleanData = {};
        let allowedFields = Terminate_configuration.allowFields();
        allowedFields.push(Terminate_configuration._primaryKey());
    
        for (const key in data) {
          if (allowedFields.includes(key)) {
            cleanData[key] = data[key];
          }
        }
        return cleanData;
      };
    
      Terminate_configuration.getConfigurations = async () => {
          return await Terminate_configuration.findAll();
      }
    
      return Terminate_configuration;
};
