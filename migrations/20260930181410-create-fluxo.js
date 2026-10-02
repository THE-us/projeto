'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fluxo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      seq: {
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.DATEONLY
      },
      hora: {
        type: Sequelize.TIME
      },
      placa: {
        type: Sequelize.STRING(7)
      },
      velMed: {
        type: Sequelize.SMALLINT
      },
      tamVeic: {
        type: Sequelize.SMALLINT
      },
      classVeic: {
        type: Sequelize.STRING(3)
      },
      pesoBt: {
        type: Sequelize.INTEGER
      },
      dataRecebimento: {
        type: Sequelize.DATE
      },
      equipamentoId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Fluxo');
  }
};