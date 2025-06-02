const Sequelize = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

async function createTable(tableName){
  const Model = sequelize.define(
      tableName,
      {
          core : {
              type: Sequelize.STRING(20),
              allowNull : false,
          },
          task : {
              type: Sequelize.STRING(20),
              allowNull : false,
          },
          usaged : {
              type:Sequelize.INTEGER.UNSIGNED,
              allowNull:false,
          },
      },
      {
          sequelize,
          timestamps: false,
          underscored: false,
          modelName: 'Profile',
          tableName: tableName,
          paranoid: false,
          charset: 'utf8',
          collate: 'utf8_general_ci',
      }
  );
  await Model.sync();

  return Model;
}


async function createDynamicTable(profile, tableName) {
  const DynamicModel = await createTable(tableName);

  let core_row = -1;

  for (let row = 0; row < profile.length; row++) {
    const line = profile[row];

    // 완전히 빈 줄이면 다음 블록 시작
    if (!line || line.length === 0 || line.every(cell => cell === undefined || cell === null || cell === '')) {
      core_row = -1;
      continue;
    }

    // task header 저장
    if (core_row === -1) {
      core_row = row;
      continue;
    }

    // core row 처리
    for (let column = 0; column < profile[row].length-1; column++) {
      const taskName = profile[core_row][column + 1];
      const usage = profile[row][column+1];
      const core = profile[row][0];

      // 방어 코드
      if (!taskName || !core || usage === undefined || usage === null) continue;

      await DynamicModel.create({
        task: taskName,
        core: core,
        usaged: usage,
      });
    }
  }
}

async function getTableList() {
  const query = 'SHOW TABLES'; // 데이터베이스별로 조회 방식이 다를 수 있으므로 사용하는 데이터베이스에 맞는 쿼리를 사용

  // 쿼리 실행
  const [results, metadata] = await sequelize.query(query);

  // 테이블 목록 추출
  const tableList = results.map((result) => result.Tables_in_javaweb); // 'database'는 실제 사용하는 데이터베이스 이름으로 변경

  return tableList;
}

async function dropTable(tableName) {
  try {
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`테이블 '${tableName}'이(가) 삭제되었습니다.`);
  } catch (error) {
    console.error(`테이블 삭제 중 오류가 발생했습니다: ${error}`);
  }
}

const db = {
  sequelize,
  Sequelize,
  createDynamicTable,
  getTableList,
  dropTable,
};

module.exports = db;