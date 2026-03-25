const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {

    try {
        if(!req.user){
            //HTTP UNAUTHORISED
            return res.status(401).json({message: "You must login to do that"});
        }

        if(Number(req.user.roleId) !== 1 && Number(req.user.roleId) !== 2){
            //HTTP FORBIDDEN
            return res.status(403).json({message: "You are not allowed to do that"});
        }

        // console.log(`handleGetAllStudents() req.user:`, req.user);

        //const { name, className, section, roll } = payload;
        const payload = req.params;
        const result = await getAllStudents(payload);

        const data = {students: result};
        // console.log(`handleGetAllStudents() {payload}, {data}:`, payload, data);

        //HTTP OK
        return res.status(200).json(data);

    } catch(error) {

        //HTTP INTERNAL SERVER ERROR
        return res.status(500).json({message: error.message});
    }

});

const handleAddStudent = asyncHandler(async (req, res) => {

    try {
        if(!req.user){
            //HTTP UNAUTHORISED
            return res.status(401).json({message: "You must login to do that"});
        }

        if(Number(req.user.roleId) !== 1 && Number(req.user.roleId) !== 2){
            //HTTP FORBIDDEN
            return res.status(403).json({message: "You are not allowed to do that"});
        }

        //is the request well formed?
        if(
            !req.body.name ||
            !req.body.email ||
            !req.body.class_name ||
            !req.body.section_name ||
            !req.body.roll ||
            !req.body.dob ||
            !req.body.father_name ||
            !req.body.father_phone
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in request body, check API documentation", body: req.body});
        }

        const payload = req.body;
        const result = await addNewStudent(payload);

        //HTTP CREATED
        return res.status(201).json(result);

    } catch(error) {

        //HTTP INTERNAL SERVER ERROR
        return res.status(500).json({message: error.message});
    }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {

    try {
        if(!req.user){
            //HTTP UNAUTHORISED
            return res.status(401).json({message: "You must login to do that"});
        }

        if(Number(req.user.roleId) !== 1 && Number(req.user.roleId) !== 2){
            //HTTP FORBIDDEN
            return res.status(403).json({message: "You are not allowed to do that"});
        }

        //is the request well formed?
        if(
            !req.body.name ||
            !req.body.phone
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in request body, check API documentation", body: req.body});
        }

        //is the request well formed?
        if(
            !req.params.id
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in url params, check API documentation", params: req.params});
        }

        const payload = req.body;
        payload.userId = req.params.id;
        const result = await updateStudent(payload);

        //HTTP OK
        return res.status(200).json(result);

    } catch(error) {

        //HTTP INTERNAL SERVER ERROR
        return res.status(500).json({message: error.message});
    }
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {

    try {
        if(!req.user){
            //HTTP UNAUTHORISED
            return res.status(401).json({message: "You must login to do that"});
        }

        if(Number(req.user.roleId) !== 1 && Number(req.user.roleId) !== 2){
            //HTTP FORBIDDEN
            return res.status(403).json({message: "You are not allowed to do that"});
        }

        //is the request well formed?
        if(
            !req.params.id
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in url params, check API documentation", params: req.params});
        }

        const userId = req.params.id;
        const result = await getStudentDetail(userId);

        //HTTP OK
        return res.status(200).json(result);

    } catch(error) {

        //HTTP INTERNAL SERVER ERROR
        return res.status(500).json({message: error.message});
    }
});

const handleStudentStatus = asyncHandler(async (req, res) => {

    try {
        if(!req.user || !req.user.id){
            //HTTP UNAUTHORISED
            return res.status(401).json({message: "You must login to do that"});
        }

        if(Number(req.user.roleId) !== 1 && Number(req.user.roleId) !== 2){
            //HTTP FORBIDDEN
            return res.status(403).json({message: "You are not allowed to do that"});
        }

        //is the request well formed?
        if(
            !req.body.status
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in request body, check API documentation", body: req.body});
        }

        //is the request well formed?
        if(
            !req.params.id
        ) {
            //HTTP BAD REQUEST
            return res.status(400).json({message: "Missing field in url params, check API documentation", params: req.params});
        }

        //{userId, reviewerId, status};

        const payload = {userId: req.params.id, status: req.body.status, reviewerId: req.user.id};
        // console.log(`handleStudentStatus() {params}, {body}, {payload}, {user}: `, req.params, req.body, payload, req.user);
        const result = await setStudentStatus(payload);

        //HTTP OK
        return res.status(200).json(result);

    } catch(error) {

        //HTTP INTERNAL SERVER ERROR
        return res.status(500).json({message: error.message});
    }
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
