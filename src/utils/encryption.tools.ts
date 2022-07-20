import * as crypto from 'node:crypto';
import { refreshData } from 'src/types/refresh.type';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encryptObject = (data: refreshData): string => {

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv,
    );

    return Buffer.concat([
        cipher.update(JSON.stringify(data)),
        cipher.final(),
        iv
    ]).toString('hex');
}

const decryptObject = (data: string): refreshData => {

    const binData = Buffer.from(data, 'hex');
    const encryptedData = binData.slice(0, binData.length - 16);
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        iv,
    );

    return JSON.parse(
        Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]).toString()
    );
}

export {
    encryptObject,
    decryptObject
}