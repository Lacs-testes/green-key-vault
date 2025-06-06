
export const generateCredentials = (companyName: string): { username: string; password: string } => {
  // Limpar o nome da empresa
  const cleanName = companyName.trim();
  
  let username = cleanName
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '.')
    .toUpperCase();
  
  if (username.length > 15) {
    username = username.substring(0, 15);
    if (username.endsWith('.')) {
      username = username.substring(0, 14);
    }
  }
  
  const words = cleanName.split(/\s+/);
  const firstWord = words[0];
  let passwordBase = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  
  const maxPasswordBaseLength = 12 - 4;
  if (passwordBase.length > maxPasswordBaseLength) {
    passwordBase = passwordBase.substring(0, maxPasswordBaseLength);
  }
  
  const password = passwordBase + '@123';
  
  return { username, password };
};
