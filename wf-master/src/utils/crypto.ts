import CryptoJS from 'crypto-js';
let MyCryptoJS = {
  iv: CryptoJS.enc.Utf8.parse("A-16-Byte-String"),
  mYsecretKey: 'A-16-Byte-String',
  // 加密
  // content   需要加密的内容
  // secretKey 登录的时候从后端获取的  修改密码的时候是上面的的 mYsecretKey
  encrypt: function(content:string, secretKey:string) {
    let password = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    return password;
  },
  // 解密
  // content   需要解密的内容
  // secretKey 登录的时候从后端获取的  修改密码的时候是上面的的 mYsecretKey
  decrypt: function(content:string,secretKey:string) {
    let decrypt = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(secretKey), 
    { 
      iv: this.iv,
      mode: CryptoJS.mode.CBC, 
      padding: CryptoJS.pad.Pkcs7 
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
}

export default MyCryptoJS
