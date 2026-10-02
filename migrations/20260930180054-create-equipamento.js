'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Equipamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING(11)
      },
      faixa: {
        type: Sequelize.TINYINT
      },
      tipo: {
        type: Sequelize.ENUM('CEV', 'REV', 'CEM')
      },
      ativo: {
        type: Sequelize.TINYINT
      },
      local: {
        type: Sequelize.STRING(80)
      },
      marca: {
        type: Sequelize.STRING(40)
      },
      modelo: {
        type: Sequelize.STRING(40)
      },
      velocidadeLimite: {
        type: Sequelize.SMALLINT
      },
      dataAfericao: {
        type: Sequelize.DATEONLY
      },
      lacre: {
        type: Sequelize.STRING(20)
      },
      dataRegistroInmetro: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      numeroInmetro: {
        type: Sequelize.STRING(30)
      },
      integradorId: {
        type: Sequelize.INTEGER
      },
      municipioId: {
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
    await queryInterface.dropTable('Equipamentos');
  }
};