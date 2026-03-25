// Mock dependencies
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({}),
    },
  })),
}));

jest.mock('src/shared/repository', () => ({
  findUserById: jest.fn(),
}));

jest.mock('src/modules/students/students-repository', () => ({
  findAllStudents: jest.fn(),
  findStudentDetail: jest.fn(),
  findStudentToSetStatus: jest.fn(),
  addOrUpdateStudent: jest.fn(),
}));

// Mock the students-service
jest.mock('src/modules/students/students-service', () => ({
    getAllStudents: jest.fn(),
    addNewStudent: jest.fn(),
    getStudentDetail: jest.fn(),
    setStudentStatus: jest.fn(),
    updateStudent: jest.fn(),
}));

const {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
} = require('src/modules/students/students-controller');

const studentsService = require('src/modules/students/students-service');

describe('Students Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { id: 1, roleId: 1 },
            params: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('handleGetAllStudents', () => {
        it('should return 401 if no user', async () => {
            req.user = null;

            await handleGetAllStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'You must login to do that' });
        });

        it('should return 403 if roleId not 1 or 2', async () => {
            req.user.roleId = 3;

            await handleGetAllStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to do that' });
        });

        it('should return 200 with students data on success', async () => {
            const mockStudents = [{ id: 1, name: 'John' }];
            studentsService.getAllStudents.mockResolvedValue(mockStudents);

            await handleGetAllStudents(req, res);

            expect(studentsService.getAllStudents).toHaveBeenCalledWith(req.params);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should return 500 on service error', async () => {
            const error = new Error('Service error');
            studentsService.getAllStudents.mockRejectedValue(error);

            await handleGetAllStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('handleAddStudent', () => {
        beforeEach(() => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                class_name: 'Class 1',
                section_name: 'A',
                roll: '1',
                dob: '2000-01-01',
                father_name: 'Father',
                father_phone: '1234567890',
            };
        });

        it('should return 401 if no user', async () => {
            req.user = null;

            await handleAddStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'You must login to do that' });
        });

        it('should return 403 if roleId not 1 or 2', async () => {
            req.user.roleId = 3;

            await handleAddStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to do that' });
        });

        it('should return 400 if missing required fields', async () => {
            delete req.body.name;

            await handleAddStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in request body, check API documentation',
                body: req.body,
            });
        });

        it('should return 201 on success', async () => {
            const mockResult = { message: 'Student added' };
            studentsService.addNewStudent.mockResolvedValue(mockResult);

            await handleAddStudent(req, res);

            expect(studentsService.addNewStudent).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 500 on service error', async () => {
            const error = new Error('Service error');
            studentsService.addNewStudent.mockRejectedValue(error);

            await handleAddStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('handleUpdateStudent', () => {
        beforeEach(() => {
            req.params.id = '1';
            req.body = {
                name: 'Updated Name',
                phone: '0987654321',
            };
        });

        it('should return 401 if no user', async () => {
            req.user = null;

            await handleUpdateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'You must login to do that' });
        });

        it('should return 403 if roleId not 1 or 2', async () => {
            req.user.roleId = 3;

            await handleUpdateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to do that' });
        });

        it('should return 400 if missing name or phone', async () => {
            delete req.body.name;

            await handleUpdateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in request body, check API documentation',
                body: req.body,
            });
        });

        it('should return 400 if missing id in params', async () => {
            delete req.params.id;

            await handleUpdateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in url params, check API documentation',
                params: req.params,
            });
        });

        it('should return 200 on success', async () => {
            const mockResult = { message: 'Updated' };
            studentsService.updateStudent.mockResolvedValue(mockResult);

            await handleUpdateStudent(req, res);

            expect(studentsService.updateStudent).toHaveBeenCalledWith({
                ...req.body,
                userId: req.params.id,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 500 on service error', async () => {
            const error = new Error('Service error');
            studentsService.updateStudent.mockRejectedValue(error);

            await handleUpdateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('handleGetStudentDetail', () => {
        beforeEach(() => {
            req.params.id = '1';
        });

        it('should return 401 if no user', async () => {
            req.user = null;

            await handleGetStudentDetail(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'You must login to do that' });
        });

        it('should return 403 if roleId not 1 or 2', async () => {
            req.user.roleId = 3;

            await handleGetStudentDetail(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to do that' });
        });

        it('should return 400 if missing id in params', async () => {
            delete req.params.id;

            await handleGetStudentDetail(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in url params, check API documentation',
                params: req.params,
            });
        });

        it('should return 200 with student data on success', async () => {
            const mockStudent = { id: 1, name: 'John' };
            studentsService.getStudentDetail.mockResolvedValue(mockStudent);

            await handleGetStudentDetail(req, res);

            expect(studentsService.getStudentDetail).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStudent);
        });

        it('should return 500 on service error', async () => {
            const error = new Error('Service error');
            studentsService.getStudentDetail.mockRejectedValue(error);

            await handleGetStudentDetail(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('handleStudentStatus', () => {
        beforeEach(() => {
            req.params.id = '1';
            req.body.status = 'active';
        });

        it('should return 401 if no user or no user.id', async () => {
            req.user = null;

            await handleStudentStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'You must login to do that' });
        });

        it('should return 403 if roleId not 1 or 2', async () => {
            req.user.roleId = 3;

            await handleStudentStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to do that' });
        });

        it('should return 400 if missing status in body', async () => {
            delete req.body.status;

            await handleStudentStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in request body, check API documentation',
                body: req.body,
            });
        });

        it('should return 400 if missing id in params', async () => {
            delete req.params.id;

            await handleStudentStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing field in url params, check API documentation',
                params: req.params,
            });
        });

        it('should return 200 on success', async () => {
            const mockResult = { message: 'Status changed' };
            studentsService.setStudentStatus.mockResolvedValue(mockResult);

            await handleStudentStatus(req, res);

            expect(studentsService.setStudentStatus).toHaveBeenCalledWith({
                userId: req.params.id,
                status: req.body.status,
                reviewerId: req.user.id,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 500 on service error', async () => {
            const error = new Error('Service error');
            studentsService.setStudentStatus.mockRejectedValue(error);

            await handleStudentStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});
