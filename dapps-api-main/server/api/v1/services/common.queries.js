const insertMany = async (model, insertData) => {
  return await model.insertMany(insertData);
};

const create = async (model, insertData) => {
  return await model.create(insertData);
};

const remove = async (model, condition) => {
  return await model.remove(condition);
};

const find = async (model, condition, projection, skipObj, sort) => {
  return await model.find(condition, projection, skipObj).sort(sort);
};

const findByPagination = async (model, condition, options) => {
  return await model.paginate(condition, options);
};

const findOne = async (model, condition, projection, skipObj) => {
  return await model.findOne(condition, projection, skipObj);
};

const distinct = async (model, key) => {
  return await model.distinct(key);
};

const aggregate = async (
  model,
  condition,
  mapping) => {
  let aggr = [];
  if (condition) {
    aggr.push({
      $match: condition,
    });
    aggr = aggr.concat(mapping);
  } else {
    aggr = mapping;
  }
  return await model.aggregate(aggr);
};

const update = async (model, condition, updatedValues) => {
  return await model.update(
    condition,
    { $set: updatedValues },
    { new: true, multi: true }
  );
};

const updateArray = async (model, condition, updatedValues) => {
  return await model.update(condition, { $push: updatedValues });
};

const findOneAndUpdate = async (model, condition, updatedValues) => {
  return await model.findOneAndUpdate(
    condition,
    { $set: updatedValues },
    { new: true }
  );
};

const countDocuments = async (model, query) => {
  return await model.countDocuments(query);
};

module.exports = {
  insertMany,
  create,
  remove,
  find,
  findByPagination,
  findOne,
  update,
  findOneAndUpdate,
  countDocuments,
  aggregate,
  distinct,
  updateArray,
};
