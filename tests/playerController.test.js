import { jest } from '@jest/globals';

const mockPlayer = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn()
};

jest.unstable_mockModule('../models/player.js', () => ({
    Player: mockPlayer
}));

const { getAllPlayers, createPlayer, updatePlayer, deletePlayer } = await import('../controllers/playerController.js');

describe('Player Controller Tests', () => {
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

    describe('getAllPlayers', () => {
        test('should return all players successfully', async () => {
            const mockPlayers = [
                { id: 1, name: 'Lionel Messi', position: 'Forward', team: 'PSG', age: 36 },
                { id: 2, name: 'Cristiano Ronaldo', position: 'Forward', team: 'Al Nassr', age: 39 }
            ];

            mockPlayer.findAll.mockResolvedValue(mockPlayers);

            await getAllPlayers(req, res);

            expect(mockPlayer.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPlayers);
        });

        test('should handle error when fetching players fails', async () => {
            const errorMessage = 'Database connection error';
            mockPlayer.findAll.mockRejectedValue(new Error(errorMessage));

            await getAllPlayers(req, res);

            expect(mockPlayer.findAll).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error fetching players:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('createPlayer', () => {
        test('should create a new player successfully', async () => {
            const playerData = {
                name: 'Kylian Mbappé',
                position: 'Forward',
                team: 'Real Madrid',
                age: 25
            };
            const mockCreatedPlayer = { id: 3, ...playerData };

            req.body = playerData;
            mockPlayer.create.mockResolvedValue(mockCreatedPlayer);

            await createPlayer(req, res);

            expect(mockPlayer.create).toHaveBeenCalledWith(playerData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedPlayer);
        });

        test('should handle error when creating player fails', async () => {
            const playerData = {
                name: 'Test Player',
                position: 'Midfielder',
                team: 'Test Team',
                age: 25
            };
            const errorMessage = 'Validation error';

            req.body = playerData;
            mockPlayer.create.mockRejectedValue(new Error(errorMessage));

            await createPlayer(req, res);

            expect(mockPlayer.create).toHaveBeenCalledWith(playerData);
            expect(console.error).toHaveBeenCalledWith('Error creating player:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('updatePlayer', () => {
        test('should update a player successfully', async () => {
            const playerId = '1';
            const updateData = {
                name: 'Lionel Messi Updated',
                position: 'Forward',
                team: 'Inter Miami',
                age: 36
            };
            const mockUpdatedPlayer = { id: 1, ...updateData };

            req.params = { id: playerId };
            req.body = updateData;
            mockPlayer.update.mockResolvedValue([1]);
            mockPlayer.findOne.mockResolvedValue(mockUpdatedPlayer);

            await updatePlayer(req, res);

            expect(mockPlayer.update).toHaveBeenCalledWith(updateData, { where: { id: playerId } });
            expect(mockPlayer.findOne).toHaveBeenCalledWith({ where: { id: playerId } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedPlayer);
        });

        test('should return 404 when player to update is not found', async () => {
            const playerId = '999';
            const updateData = { name: 'Non-existent Player' };

            req.params = { id: playerId };
            req.body = updateData;
            mockPlayer.update.mockResolvedValue([0]);
            await updatePlayer(req, res);

            expect(mockPlayer.update).toHaveBeenCalledWith(updateData, { where: { id: playerId } });
            expect(mockPlayer.findOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
        });

        test('should handle error when updating player fails', async () => {
            const playerId = '1';
            const updateData = { name: 'Test Update' };
            const errorMessage = 'Database error';

            req.params = { id: playerId };
            req.body = updateData;
            mockPlayer.update.mockRejectedValue(new Error(errorMessage));

            await updatePlayer(req, res);

            expect(mockPlayer.update).toHaveBeenCalledWith(updateData, { where: { id: playerId } });
            expect(console.error).toHaveBeenCalledWith('Error updating player:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('deletePlayer', () => {
        test('should delete a player successfully', async () => {
            const playerId = '1';

            req.params = { id: playerId };
            mockPlayer.destroy.mockResolvedValue(1);

            await deletePlayer(req, res);

            expect(mockPlayer.destroy).toHaveBeenCalledWith({ where: { id: playerId } });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('should return 404 when player to delete is not found', async () => {
            const playerId = '999';

            req.params = { id: playerId };
            mockPlayer.destroy.mockResolvedValue(0);

            await deletePlayer(req, res);

            expect(mockPlayer.destroy).toHaveBeenCalledWith({ where: { id: playerId } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Player not found' });
        });

        test('should handle error when deleting player fails', async () => {
            const playerId = '1';
            const errorMessage = 'Database error';

            req.params = { id: playerId };
            mockPlayer.destroy.mockRejectedValue(new Error(errorMessage));

            await deletePlayer(req, res);

            expect(mockPlayer.destroy).toHaveBeenCalledWith({ where: { id: playerId } });
            expect(console.error).toHaveBeenCalledWith('Error deleting player:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});