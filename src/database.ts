import { MongoClient, Db } from "mongodb"

const uri = Bun.env.MONGODB_URI

if (!uri) throw new Error("MONGODB_URI não definida no .env")

const client = new MongoClient(uri)
let db: Db

export async function inicializarBanco() {
    await client.connect()
    db = client.db("KRATOS")
    await db.collection("usuarios").createIndex({ email: 1 }, { unique: true })
    console.log("MongoDB conectado!")
}

export function getDb() {
    if (!db) throw new Error("Banco não inicializado")
    return db
}