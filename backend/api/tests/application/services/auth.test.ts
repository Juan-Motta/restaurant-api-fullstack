import { AuthService } from '../../../src/application/services/auth'
import { IUserRepository } from '../../../src/domain/repositories/users'
import { IPasswordManager } from '../../../src/domain/utils/password'
import { IJwtManager } from '../../../src/domain/utils/jwt'
import { ApiError } from '../../../src/domain/exceptions/custom'

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: IUserRepository;
    let passwordManager: IPasswordManager;
    let jwtManager: IJwtManager;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
        } as unknown as IUserRepository;

        passwordManager = {
            verifyPassword: jest.fn(),
        } as unknown as IPasswordManager;

        jwtManager = {
            sign: jest.fn(),
            verify: jest.fn(),
        } as unknown as IJwtManager;

        authService = new AuthService(userRepository, passwordManager, jwtManager);
    });

    describe('getUserByEmail', () => {
        it('should return user if found', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'Test User' };
            userRepository.findByEmail = jest.fn().mockResolvedValue(user);
            const result = await authService.getUserByEmail('test@example.com');
            expect(result).toEqual(user);
        });

        it('should throw ApiError if user not found', async () => {
            userRepository.findByEmail = jest.fn().mockResolvedValue(null);
            await expect(authService.getUserByEmail('nonexistent@example.com')).rejects.toThrow(ApiError);
        });
    });

    describe('verifyPassword', () => {
        it('should return true if password is valid', async () => {
            const storedPassword = 'hashedPassword';
            const providedPassword = 'password';
            passwordManager.verifyPassword = jest.fn().mockReturnValue(true);
            const result = await authService.verifyPassword(storedPassword, providedPassword);
            expect(result).toBe(true);
        });

        it('should throw ApiError if password is invalid', async () => {
            const storedPassword = 'hashedPassword';
            const providedPassword = 'wrongPassword';
            passwordManager.verifyPassword = jest.fn().mockReturnValue(false);
            await expect(authService.verifyPassword(storedPassword, providedPassword)).rejects.toThrow(ApiError);
        });
    });

    describe('login', () => {
        it('should return access token on successful login', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'Test User' };
            userRepository.findByEmail = jest.fn().mockResolvedValue(user);
            passwordManager.verifyPassword = jest.fn().mockReturnValue(true);
            jwtManager.sign = jest.fn().mockReturnValue('mockedToken');

            const result = await authService.login('test@example.com', 'password');
            expect(result).toEqual({ accessToken: 'mockedToken' });
        });

        it('should throw ApiError if login fails', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'Test User' };
            userRepository.findByEmail = jest.fn().mockResolvedValue(user);
            passwordManager.verifyPassword = jest.fn().mockReturnValue(false);
            await expect(authService.login('test@example.com', 'wrongPassword')).rejects.toThrow(ApiError);
        });
    });

    describe('verifyHeader', () => {
        it('should throw ApiError if header is missing', async () => {
            const req = { headers: {} } as any; // Mock IncomingMessage
            await expect(authService.verifyHeader(req)).rejects.toThrow(ApiError);
        });

        it('should throw ApiError if token type is invalid', async () => {
            const req = { headers: { authorization: 'Basic fakeToken' } } as any;
            await expect(authService.verifyHeader(req)).rejects.toThrow(ApiError);
        });

        it('should call verifyJwt if header is valid', async () => {
            const req = { headers: { authorization: 'Bearer validToken' } } as any;
            jwtManager.verify = jest.fn().mockReturnValue({});
            await authService.verifyHeader(req);
            expect(jwtManager.verify).toHaveBeenCalledWith('validToken');
        });
    });
});