import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ordenCocinaHandler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'GET') {
        try {
            const ordenes = await prisma.orden_cocina.findMany();
            res.status(200).json(ordenes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las órdenes de cocina', error });
        }
    } else if (req.method === 'POST') {
        const { cliente, platillo, cantidad, estado } = req.body;
        if (!cliente || !platillo || !cantidad || !estado) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const nuevaOrden = await prisma.orden_cocina.create({
                data: {
                    cliente,
                    platillo,
                    cantidad: parseInt(cantidad),
                    estado
                },
            });
            res.status(201).json(nuevaOrden);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la orden de cocina', error });
        }
    } else if (req.method === 'PUT') {
        const { id, cliente, platillo, cantidad, estado } = req.body;
        if (!id || !cliente || !platillo || !cantidad || !estado) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const ordenActualizada = await prisma.orden_cocina.update({
                where: { id: parseInt(id) },
                data: {
                    cliente,
                    platillo,
                    cantidad: parseInt(cantidad),
                    estado
                },
            });
            res.status(200).json(ordenActualizada);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la orden de cocina', error });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'El id de la orden de cocina es requerido' });
        }

        try {
            const ordenEliminada = await prisma.orden_cocina.delete({
                where: { id: parseInt(id as string) },
            });
            res.status(200).json(ordenEliminada);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la orden de cocina', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}