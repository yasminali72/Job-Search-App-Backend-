export const create = async ({ model, data = {} } = {}) => {
  const document = await model.create(data);
  return document;
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populat = [],
  skip = 0,
  limit = 1000,
} = {}) => {
  const document = await model
    .find(filter)
    .select(select)
    .populat(populat)
    .skip(skip)
    .limit(limit);
  return document;
};

export const findOne = async ({
  model,
  filter = {},
  select = "",
  populat = [],
} = {}) => {
  const document = await model.findOne(filter).select(select).populat(populat);
  return document;
};
export const findById = async ({
  model,
  id = "",
  select = "",
  populat = [],
} = {}) => {
  const document = await model.findById(id).select(select).populat(populat);
  return document;
};
