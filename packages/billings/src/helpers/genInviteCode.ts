
export const GenerateInviteCodeHandle = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 10; i++) {
    const ramdom = Math.random();

    const idx = Math.floor(ramdom * chars.length);

    result += chars.charAt(idx);
  }

  return result
}
