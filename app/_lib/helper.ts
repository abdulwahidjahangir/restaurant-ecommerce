import crypto from "crypto"

export function generateUniqueString() {
    return crypto.randomBytes(10).toString("hex").slice(0, 9);
}

export function isValid(value: string) {
    return value !== null && value !== undefined && value.trim() !== '';
}

