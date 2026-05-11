import crypto from 'node:crypto';

export const encryption=(plainText)=>{
    const iv=crypto.randomBytes(16);
    const cipher=crypto.createCipheriv('aes-256-cbc',Buffer.from('12345678123456781234567812345678'),iv);
    let encryptionData=cipher.update(plainText,'utf-8','hex');
    encryptionData+=cipher.final('hex');
    return `${iv.toString('hex')}:${encryptionData}`;
}

export const decryption=(encrypedData)=>{
    const[iv,encrypedValue]=encrypedData.split(':');
    const isBufferLike=Buffer.from(iv,'hex');   
    const decipher=crypto.createDecipheriv('aes-256-cbc','12345678123456781234567812345678',isBufferLike);
    let decryptedData=decipher.update(encrypedValue,'hex','utf-8');
    decryptedData+=decipher.final('utf-8'); 
    return decryptedData;
}