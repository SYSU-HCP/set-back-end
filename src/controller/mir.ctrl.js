const debug = require('debug')('ats:api-mir');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');

async function parseMIR(ctx) {
  let data = null;
  data = {
  };
  ctx.body = new IResponse(ctx, 'ok', data);
}
module.exports = {
    getMIR()
};
