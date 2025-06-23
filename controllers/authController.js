import { Coordinator } from "../models/auth.js"
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const coordinator = await Coordinator.findOne({ where: { email } });
        if (!coordinator) {
            return res.status(401).json({ error: 'Email or password incorrect' });
        }

        const isMatch = await bcrypt.compare(password, coordinator.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email or password incorrect' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingCoordinator = await Coordinator.findOne({ where: { email } });

        if (existingCoordinator) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Coordinator.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteCoordinator = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Coordinator.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Coordinator not found' });
        }
    } catch (error) {
        console.error('Error deleting coordinator:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}