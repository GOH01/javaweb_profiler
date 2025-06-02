const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const { createDynamicTable, getTableList, sequelize, dropTable } = require('../models/index');
const profile_model = require('../models/profile');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // ← 원래 이름으로 저장
    }
  });

// 엑셀 업로드를 위한 multer 설정
const upload = multer({ storage: storage });

// 엑셀 업로드 및 처리 라우터
router.post('/uploadExcel', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const originalFileName = path.parse(req.file.originalname).name.toLowerCase();
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // 블록 병합: 빈 줄 기준으로 블록 나누지 않고 모든 데이터를 하나로 통합
    const merged = json.filter(row => !(row.every(cell => cell === undefined || cell === null || cell === '')));

    // DB 테이블 목록 가져오기
    const tableList = await getTableList();

    // 테이블 이름 중복 확인
    if (tableList.includes(originalFileName)) {
        fs.unlinkSync(filePath);
        return res.json({ status: 'fail', message: '이미 존재하는 테이블 이름입니다.' });
    }

    // 테이블 생성 및 데이터 저장
    try {
        await createDynamicTable(merged, originalFileName);
        fs.unlinkSync(filePath);
        res.json({ tableName: $(originalFileName), status: 'success', message: `파일 '${originalFileName}'로 테이블이 저장되었습니다.` });
    } catch (err) {
        fs.unlinkSync(filePath);
        res.status(500).json({ status: 'error', message: '테이블 저장 중 오류 발생.', error: err.message });
    }
});

// DB에서 table 목록 전체를 불러오고, Json 문서 형식으로 변환해서 응답하는 부분
router.get('/', async (req,res)=>{
    const tableList = await getTableList();
    res.json(tableList);
});

// 해당 테이블 명을 가진 Table을 호출하는 부분이다.
router.get('/data/:tableName', async (req,res)=>{
    try{
        const {tableName} = req.params;
        const tableList = await getTableList();

        if(!tableList.includes(tableName)){
            return res.status(404).json({error:'존재하지 않는 파일입니다.'});
        }

        profile_model.initiate(sequelize, tableName);

        const datas = await profile_model.findAll();

        const tasks = await profile_model.findAll({
            attributes: [sequelize.fn('DISTINCT', sequelize.col('core')), 'core'],
        });

        const cores = await profile_model.findAll({
            attributes: [sequelize.fn('DISTINCT', sequelize.col('task')), 'task'],
        });

        res.json({datas: datas, cores : cores, tasks : tasks});
    }catch(error){
        console.error('데이터 조회 오류', error);
    }
});

// 해당 테이블을 삭제하는 기능
router.delete('/drop/:tableName', async(req,res)=>{
    try{
        const {tableName} = req.params;
        dropTable(tableName);
        res.json({state:'success'});
    }catch(error){
        res.json({state:'error'});
    }
});

// CORE 기준으로 TASK그래프 표기시 사용하는 데이터 가공처리
router.get('/coredata/:tableName/:core', async(req,res)=>{
    const { tableName, core } = req.params;
    profile_model.initiate(sequelize, tableName);

    const data = await profile_model.findAll({
        attributes: [
          'task',
          [sequelize.fn('max', sequelize.col('usaged')), 'max_usaged'],
          [sequelize.fn('min', sequelize.col('usaged')), 'min_usaged'],
          [sequelize.fn('avg', sequelize.col('usaged')), 'avg_usaged']
        ],
        where: { core: core },
        group: ['task']
    });

    res.json(data);
});

// TASK 기준으로 CORE그래프 표기시 사용하는 데이터 가공처리
router.get('/taskdata/:tableName/:task', async(req,res)=>{
    const { tableName, task } = req.params;
    profile_model.initiate(sequelize, tableName);

    const data = await profile_model.findAll({
        attributes: [
          'core',
          [sequelize.fn('max', sequelize.col('usaged')), 'max_usaged'],
          [sequelize.fn('min', sequelize.col('usaged')), 'min_usaged'],
          [sequelize.fn('avg', sequelize.col('usaged')), 'avg_usaged']
        ],
        where: { task: task },
        group: ['core']
    });

    res.json(data);
});

// 1️⃣ 분석 API - 최근 테이블 기준 core/task 별 min/max/avg
router.get('/analyze/:tableName', async (req, res) => {
  try {
    const tableName = req.params;
    const tableList = await getTableList();
    if (tableList.length === 0) {
      return res.status(400).json({ message: '테이블이 없습니다.' });
    }
 
    profile_model.initiate(sequelize, tableName);

    // Core 기준 통계
    const coreStats = await profile_model.findAll({
      attributes: [
        'core',
        [sequelize.fn('MIN', sequelize.col('usaged')), 'min_usaged'],
        [sequelize.fn('MAX', sequelize.col('usaged')), 'max_usaged'],
        [sequelize.fn('AVG', sequelize.col('usaged')), 'avg_usaged']
      ],
      group: ['core']
    });

    // Task 기준 통계
    const taskStats = await profile_model.findAll({
      attributes: [
        'task',
        [sequelize.fn('MIN', sequelize.col('usaged')), 'min_usaged'],
        [sequelize.fn('MAX', sequelize.col('usaged')), 'max_usaged'],
        [sequelize.fn('AVG', sequelize.col('usaged')), 'avg_usaged']
      ],
      group: ['task']
    });

    res.json({
      table: tableName,
      coreStats,
      taskStats
    });
  } catch (error) {
    console.error('분석 중 오류:', error);
    res.status(500).json({ message: '분석 중 오류 발생', error: error.message });
  }
});

module.exports = router;
