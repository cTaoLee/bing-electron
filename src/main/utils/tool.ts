/**
 * 生成随机数
 * @param minNum
 * @param maxNum
 */
export function randomNum(minNum,maxNum){
  switch(arguments.length){
    case 1:
      return parseInt(String(Math.random() * minNum + 1),10);
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
    default:
      return 0;
  }
}

/**
 * 生成 uuid
 */
export function uuid() {
  const s: any = [];
  const hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
}

/**
 * 生成任意长度的随机Hex字符串
 * @param num
 */
export function getRanHex(num: number) {
  const hexDigits = "0123456789abcdef";
  let hex = "";
  for (let i = 0; i < num; i++) {
    hex += hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return hex;
}
