import dotenv from "dotenv";
dotenv.config();

// Convert secret into Uint8Array
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default JWT_SECRET;
