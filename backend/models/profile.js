const { Sequelize, DataTypes } = require('sequelize');

let ProfileModel;

module.exports = {
  // 1️⃣ 동적으로 테이블 연결
  initiate: (sequelize, tableName) => {
    ProfileModel = sequelize.define(
      'Profile',
      {
        core: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        task: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        usaged: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Profile',
        tableName, // <- 여기가 핵심: 테이블명을 동적으로 설정
        timestamps: false,
      }
    );
    return ProfileModel;
  },

  // 2️⃣ findAll 쿼리 메서드
  findAll: async (...args) => {
    if (!ProfileModel) throw new Error('Model not initialized. Call initiate() first.');
    return ProfileModel.findAll(...args);
  }
};
