var ApiResponse = function (cnf) {
    this.success = cnf.success;
    this.extras = cnf.extras;
	this.data = cnf.data;
	this.err = cnf.err;
	this.msg = cnf.msg;
};

module.exports = ApiResponse;