import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/data/users.json');
const ROOMS_PATH = path.join(process.cwd(), 'src/lib/data/rooms.json');

import { User, SteamGame, Participant, GameVote, Room } from '../api/types';
export type { User, SteamGame, Participant, GameVote, Room };

export interface HistoryEntry {
  juego: string;
  accion: "visto" | "click";
  timestamp: number;
}

export async function getUserBySteamId(steamId: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u: User) => u.steamId === steamId) || null;
}

export async function saveUser(user: User): Promise<void> {
  const users = await getAllUsers();
  const index = users.findIndex((u: User) => u.steamId === user.steamId);
  
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

async function getAllUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Room functions
export async function getRoomByCode(code: string): Promise<Room | null> {
  const rooms = await getAllRooms();
  return rooms.find((r: Room) => r.code === code) || null;
}

export async function saveRoom(room: Room): Promise<void> {
  const rooms = await getAllRooms();
  const index = rooms.findIndex((r: Room) => r.code === room.code);
  
  if (index !== -1) {
    rooms[index] = { ...room, lastUpdate: Date.now() };
  } else {
    rooms.push({ ...room, lastUpdate: Date.now() });
  }
  
  await fs.mkdir(path.dirname(ROOMS_PATH), { recursive: true });
  await fs.writeFile(ROOMS_PATH, JSON.stringify(rooms, null, 2));
}

async function getAllRooms(): Promise<Room[]> {
  try {
    const data = await fs.readFile(ROOMS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
