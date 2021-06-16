const DEFAULT_SUCCESS_RESPONSE = {
  error: false,
  errorMsg: null,
}

const DEFAULT_ERROR_RESPONSE = {
  error: true,
  errorMsg: 'no error msg provided :(',
}

function publicSuccessRes(data) {
  return { ...DEFAULT_SUCCESS_RESPONSE, ...data }
}

function publicErrorRes(data) {
  return { ...DEFAULT_ERROR_RESPONSE, ...data }
}

module.exports = {
  publicSuccessRes,
  publicErrorRes,
}
