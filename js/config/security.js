import sha from 'js-sha256';
import { Base64 } from 'js-base64';

export function bb64encod(password){
    const arr = sha.array(password);
    var ascii = new Uint8Array(arr);
    var b64encoded = Base64.encode(String.fromCharCode.apply(null, ascii));
    
    var utf8 = unescape(encodeURIComponent(b64encoded));
    var arr2 = [];
    for (var i = 0; i < utf8.length; i++) {
        arr2.push(utf8.charCodeAt(i));
    }
    var a = new Uint8Array(arr2);
    var bb64encoded = Base64.encode(String.fromCharCode.apply(null, a));
    return bb64encoded
}