// pages/api/register.js
import { PrismaClient } from '@prisma/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase'; // Adjust the path as necessary

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, fullName } = req.body;

        try {
            // Create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update the user's profile with their full name
            await updateProfile(userCredential.user, { displayName: fullName });

            // Save user data to MongoDB using Prisma
            await prisma.user.create({
                data: {
                    email: email,
                    name: fullName,
                    password: password, // Ensure you hash the password before saving
                },
            });

            res.status(201).json({ message: 'User  created successfully!' });
        } catch (error) {
            console.error('Error signing up:', error);
            res.status(500).json({ error: error.message || 'Failed to create account.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}