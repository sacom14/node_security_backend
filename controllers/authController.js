import { Coordinator } from "../models/auth.js"

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const coordinator = await Coordinator.findOne({ where: { email } });
        if (!coordinator || coordinator.password !== password) {
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

        const newCoordinator = await Coordinator.create({ name, email, password });
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}