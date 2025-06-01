async function createDynamicTable(profile, tableName) {
    const DynamicModel = await createTable(tableName);
  
    let core_row = -1;
    for (let row = 0; row < profile.length; row++) {
      if (core_row === -1) {
        core_row = row;
        continue;
      }
      if (profile[row].length === 1) {
        core_row = -1;
        continue;
      }
  
      for (let column = 1; column < profile[row].length; column++) {
        await DynamicModel.create({
          task: profile[core_row][column - 1],
          core: profile[row][0],
          usaged: profile[row][column],
        });
      }
    }
  }