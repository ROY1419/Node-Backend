class ApiResponse {
    constructor(statuscode, data, message = "Success"){
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = statuscode < 400
    }
}

export { ApiResponse }