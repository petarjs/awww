module.exports = {
  error: function(error) {
    return {
      status: false,
      error: error,
      data: null
    }
  },
  data: function(data) {
    return {
      status: true,
      error: null,
      data: data
    }
  }
}