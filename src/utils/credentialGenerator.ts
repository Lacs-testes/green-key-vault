
export const generateCredentials = (companyName: string): { username: string; password: string } => {
  // Limpar o nome da empresa
  const cleanName = companyName.trim();
  
  // Gerar usuário
  const words = cleanName
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais
    .split(/\s+/) // Divide por espaços
    .filter(word => word.length > 0); // Remove palavras vazias
  
  let usernamePart = '';
  
  if (words.length >= 2) {
    // Usa as duas primeiras palavras
    usernamePart = `${words[0]}.${words[1]}`;
  } else if (words.length === 1) {
    // Se só tem uma palavra, divide ela ao meio
    const word = words[0];
    const middle = Math.ceil(word.length / 2);
    usernamePart = `${word.substring(0, middle)}.${word.substring(middle)}`;
  } else {
    // Fallback
    usernamePart = 'USER.NAME';
  }
  
  // Garante que o username tenha entre 6 e 15 caracteres antes do sufixo
  if (usernamePart.length < 6) {
    // Se for muito curto, preenche com caracteres da empresa
    const extraChars = cleanName.replace(/[^\w]/g, '').substring(usernamePart.length);
    usernamePart = (usernamePart + extraChars).substring(0, 15);
  } else if (usernamePart.length > 15) {
    // Se for muito longo, corta
    usernamePart = usernamePart.substring(0, 15);
    // Garante que termine com letra, não com ponto
    if (usernamePart.endsWith('.')) {
      usernamePart = usernamePart.substring(0, 14);
    }
  }
  
  const username = usernamePart.toUpperCase() + '3288';
  
  // Gerar senha
  // Pega uma parte do nome da empresa
  const nameForPassword = cleanName.replace(/[^\w]/g, ''); // Remove caracteres especiais
  
  // Calcula o tamanho máximo para a parte do nome (12 - 4 para @123)
  const maxNameLength = 12 - 4; // 8 caracteres máximo para o nome
  
  let passwordBase = nameForPassword.substring(0, maxNameLength);
  
  // Garante que tenha pelo menos uma letra maiúscula
  if (passwordBase.length > 0) {
    passwordBase = passwordBase.charAt(0).toUpperCase() + passwordBase.slice(1).toLowerCase();
  }
  
  // Garante que tenha pelo menos 4 caracteres para o nome (8 - 4 = 4 mínimo)
  if (passwordBase.length < 4) {
    passwordBase = passwordBase.padEnd(4, 'x');
    passwordBase = passwordBase.charAt(0).toUpperCase() + passwordBase.slice(1).toLowerCase();
  }
  
  const password = passwordBase + '@123';
  
  return { username, password };
};
