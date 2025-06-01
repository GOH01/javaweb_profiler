const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const { createDynamicTable, getTableList, sequelize, dropTable } = require('../models/index');
const profile_model = require('../models/profile');

// 엑셀 업로드를 위한 multer 설정
const upload = multer({ dest: 'uploads/' });

// 엑셀 업로드 및 처리 라우터
router.post('/uploadExcel', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // 블록 분리: 빈 줄 기준
    let blocks = [];
    let block = [];
    for (let row of json) {
        if (row.every(cell => cell === undefined || cell === null || cell === '')) {
            if (block.length > 0) {
                blocks.push(block);
                block = [];
            }
        } else {
            block.push(row);
        }
    }
    if (block.length > 0) blocks.push(block);

    // DB 테이블 목록 가져오기
    const tableList = await getTableList();
    let count = 0;

    for (let i = 0; i < blocks.length; i++) {
        const blockName = `excel_block_${i + 1}`;

        // 테이블 이름이 이미 있으면 스킵
        if (tableList.includes(blockName)) continue;

        // core/task/usaged 형태로 변환
        const [headers, ...rows] = blocks[i];
        const tasks = headers.slice(1);
        const formatted = rows.map(row => {
            const core = row[0];
            return tasks.map((task, idx) => [core, task, row[idx + 1]]);
        }).flat();

        const structured = [[blockName], ['core', 'task', 'usaged'], ...formatted];
        await createDynamicTable(structured);
        count++;
    }

    // 파일 삭제
    fs.unlinkSync(filePath);

    if (count === 0) {
        res.json({ status: 'success', message: '저장 가능한 블록이 없습니다.' });
    } else {
        res.json({ status: 'success', message: `${count}개의 블록이 저장되었습니다.` });
    }
});

// DB에서 table 목록 전체를 불러오고, Json 문서 형식으로 변환해서 응답하는 부분
router.get('/', async (req,res)=>{
    const tableList = await getTableList();
    res.json(tableList);
});

// 해당 테이블 명을 가진 Table을 호출하는 부분이다.(해당 inputfile을 클릭시, 불러오는 부분)
router.get('/data/:tableName', async (req,res)=>{
    try{
        const {tableName} = req.params;

        const tableList = await getTableList();    //1개의 테이블을 조회
        
        // 해당 table이 db에 존재하지 않으면, 오류 처리
        if(!tableList.includes(tableName)){
            return res.status(404).json({error:'존재하지 않는 파일입니다.'});
        }
        
        // 해당 table 모델을 초기화한다.
        profile_model.initiate(sequelize, tableName);

        // 테이블의 모든 데이터를 가져와서, datas에 저장함
        const datas = await profile_model.findAll();
        
        // task 기준 core처리 현황을 불러옴(
        const tasks = await profile_model.findAll({
            attributes: [sequelize.fn('DISTINCT', sequelize.col('core')), 'core'],
        });

        // core 기준 task처리 현황을 불러옴
        const cores = await profile_model.findAll({
            attributes: [sequelize.fn('DISTINCT', sequelize.col('task')), 'task'],
        });
        
        // json 문서 형태로 응답(모든 데이터, core기준 task데이터, task기준 core데이터)
        res.json({datas: datas, cores : cores, tasks : tasks});
    }catch(error){    // 오류 발생시
        console.error('데이터 조회 오류', error);
    }
});

// 해당 테이블을 삭제하는 기능 
router.delete('/drop/:tableName', async(req,res)=>{
    try{
        const {tableName} = req.params;
        dropTable(tableName);    // 클릭시 테이블 삭제하는 기능
        res.json({state:'success'});
    }catch(error){
        res.json({state:'error'});
    }
});

// CORE 기준으로 TASK그래프 표기시 사용하는 데이터 가공처리(평균, 최소, 최대)실행후 반환
router.get('/coredata/:tableName/:core', async(req,res)=>{

    const { tableName, core } = req.params;    //테이블명, core정보 가져옴

    profile_model.initiate(sequelize, tableName);    //해당 모델 초기화(데이터 담길 빈박스 가져옴)

    const data = await profile_model.findAll({
        attributes: [
          'task',
          [sequelize.fn('max', sequelize.col('usaged')), 'max_usaged'],
          [sequelize.fn('min', sequelize.col('usaged')), 'min_usaged'],
          [sequelize.fn('avg', sequelize.col('usaged')), 'avg_usaged']
        ],
        where: {
          core: core
        },
        group: ['task']
      });

    res.json(data);
});


// TASK 기준으로 CORE그래프 표기시 사용하는 데이터 가공처리(평균, 최소, 최대)실행후 반환
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
        where: {
          task: task,
        },
        group: ['core']
      });

    res.json(data);
});


module.exports = router;
