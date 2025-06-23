import { jest } from '@jest/globals';

const mockBcrypt = {
    compare: jest.fn(),
    hash: jest.fn()
};

jest.unstable_mockModule('bcrypt', () => ({
    default: mockBcrypt
}));

const mockCoordinator = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
};

jest.unstable_mockModule('../models/auth.js', () => ({
    Coordinator: mockCoordinator
}));

const bcrypt = (await import('bcrypt')).default;
const { login, register, deleteCoordinator } = await import('../controllers/authController.js');

describe('Auth Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
            send: jest.fn(() => res)
        };
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    describe('login', () => {
        test('should login successfully with valid credentials', async () => {
            const loginData = {
                email: 'coordinator@test.com',
                password: 'password123'
            };
            const mockCoordinatorData = {
                id: 1,
                name: 'Test Coordinator',
                email: 'coordinator@test.com',
                password: '$2b$10$hashedPassword'
            }; req.body = loginData;
            mockCoordinator.findOne.mockResolvedValue(mockCoordinatorData);
            mockBcrypt.compare.mockResolvedValue(true);

            await login(req, res);

            expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockCoordinatorData.password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
        });

        test('should return 401 when coordinator is not found', async () => {
            const loginData = {
                email: 'nonexistent@test.com',
                password: 'password123'
            };

            req.body = loginData;
            mockCoordinator.findOne.mockResolvedValue(null);

            await login(req, res); expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
            expect(mockBcrypt.compare).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email or password incorrect' });
        });

        test('should return 401 when password is incorrect', async () => {
            const loginData = {
                email: 'coordinator@test.com',
                password: 'wrongpassword'
            };
            const mockCoordinatorData = {
                id: 1,
                name: 'Test Coordinator',
                email: 'coordinator@test.com',
                password: '$2b$10$hashedPassword'
            }; req.body = loginData;
            mockCoordinator.findOne.mockResolvedValue(mockCoordinatorData);
            mockBcrypt.compare.mockResolvedValue(false);

            await login(req, res);

            expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockCoordinatorData.password);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email or password incorrect' });
        });

        test('should handle error during login', async () => {
            const loginData = {
                email: 'coordinator@test.com',
                password: 'password123'
            };
            const errorMessage = 'Database error';

            req.body = loginData;
            mockCoordinator.findOne.mockRejectedValue(new Error(errorMessage));

            await login(req, res);

            expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
            expect(console.error).toHaveBeenCalledWith('Error during login:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('register', () => {
        test('should register a new coordinator successfully', async () => {
            const registerData = {
                name: 'New Coordinator',
                email: 'newcoordinator@test.com',
                password: 'password123'
            };
            const hashedPassword = '$2b$10$hashedNewPassword'; req.body = registerData;
            mockCoordinator.findOne.mockResolvedValue(null);
            mockBcrypt.hash.mockResolvedValue(hashedPassword);
            mockCoordinator.create.mockResolvedValue({
                id: 2,
                name: registerData.name,
                email: registerData.email,
                password: hashedPassword
            });

            await register(req, res);

            expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: registerData.email } });
            expect(mockBcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
            expect(mockCoordinator.create).toHaveBeenCalledWith({
                name: registerData.name,
                email: registerData.email,
                password: hashedPassword
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful' });
        });

        test('should return 400 when email already exists', async () => {
            const registerData = {
                name: 'Duplicate Coordinator',
                email: 'existing@test.com',
                password: 'password123'
            };
            const existingCoordinator = {
                id: 1,
                name: 'Existing Coordinator',
                email: 'existing@test.com',
                password: '$2b$10$existingHashedPassword'
            };

            req.body = registerData;
            mockCoordinator.findOne.mockResolvedValue(existingCoordinator);

            await register(req, res); expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: registerData.email } });
            expect(mockBcrypt.hash).not.toHaveBeenCalled();
            expect(mockCoordinator.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
        });

        test('should handle error during registration', async () => {
            const registerData = {
                name: 'Test Coordinator',
                email: 'test@test.com',
                password: 'password123'
            };
            const errorMessage = 'Database error';

            req.body = registerData;
            mockCoordinator.findOne.mockRejectedValue(new Error(errorMessage));

            await register(req, res);

            expect(mockCoordinator.findOne).toHaveBeenCalledWith({ where: { email: registerData.email } });
            expect(console.error).toHaveBeenCalledWith('Error during registration:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('deleteCoordinator', () => {
        test('should delete coordinator successfully', async () => {
            const coordinatorId = '1';

            req.params = { id: coordinatorId };
            mockCoordinator.destroy.mockResolvedValue(1);
            await deleteCoordinator(req, res);

            expect(mockCoordinator.destroy).toHaveBeenCalledWith({ where: { id: coordinatorId } });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('should return 404 when coordinator to delete is not found', async () => {
            const coordinatorId = '999';

            req.params = { id: coordinatorId };
            mockCoordinator.destroy.mockResolvedValue(0);

            await deleteCoordinator(req, res);

            expect(mockCoordinator.destroy).toHaveBeenCalledWith({ where: { id: coordinatorId } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Coordinator not found' });
        });

        test('should handle error when deleting coordinator fails', async () => {
            const coordinatorId = '1';
            const errorMessage = 'Database error';

            req.params = { id: coordinatorId };
            mockCoordinator.destroy.mockRejectedValue(new Error(errorMessage));

            await deleteCoordinator(req, res);

            expect(mockCoordinator.destroy).toHaveBeenCalledWith({ where: { id: coordinatorId } });
            expect(console.error).toHaveBeenCalledWith('Error deleting coordinator:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});