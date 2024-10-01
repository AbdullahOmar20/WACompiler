import { Buffer } from "buffer";

// https://en.wikipedia.org/wiki/IEEE_754-2008
// creates a 32 bit float from a number 
export const ieee754 = (n: number):Uint8Array => {
    const buf = Buffer.allocUnsafe(8);
    //Writes the specified bytes, using little endian, to a Buffer object. 
    //The bytes should be 32 bit float.
    buf.writeDoubleLE(n,0);
    return Uint8Array.from(buf);
}

export const encodeString = (str: string):number[] => [
    str.length,
    ...str.split("").map(s=> s.charCodeAt(0))
];

//encoding a number into signed LEB128
export const signedLEB128 = (n: number):number[]=>{
    const buffer = [];
    let more = true;
    while(more){
        //extract the least significant 7 bits
        let byte = n& 0x7f;
        //right shifting 7 bits
        n>>>=7;
        //checks if the number is empty and the sign of the last byte (its 6th bit = 0) is positive
        //or the number is empty but it is negative number and the last byte (its 6th bit = 1) is negative
        //that informs that the number has finished being encoded (either it's positive or negative) 
        if(n===0 && ((byte&0x40)===0) || n===-1 && ((byte&0x40)!==0)){
            more = false;
        }
        else{
            //set the 8th bit
            byte |= 0x80;
        }
        buffer.push(byte);
    }
    return buffer;
};

//encoding a number into unsigned LEB128
export const unsignedLEB128 = (n: number):number[] =>{
    const buffer = [];
    do{
        let byte = n & 0x7f;
        n>>>=7;
        //no need for checking the positivtiy of the byte since function return an unsigned number
        if(n!==0){
            byte!=0x80;
        }
        buffer.push(byte);
    }while(n!==0);
    return buffer;
};