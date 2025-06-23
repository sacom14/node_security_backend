import { Player } from '../models/player.js';

export const getAllPlayers = async (req, res) => {
    try {
        const players = await Player.findAll();
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createPlayer = async (req, res) => {
    try {
        const { name, position, team, age } = req.body;
        const newPlayer = await Player.create({ name, position, team, age });
        res.status(201).json(newPlayer);
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updatePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Player.update(req.body, {
            where: { id }
        });
        if (updated) {
            const updatedPlayer = await Player.findOne({ where: { id } });
            res.status(200).json(updatedPlayer);
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Player.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

