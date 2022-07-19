function convertCpfToArray(cpf: string): number[] {
  const cpfArray: number[] = [];
  for (let i = 0; i < cpf.length; i += 1) {
    cpfArray.push(Number(cpf[i]));
  }

  return cpfArray;
}

function returnCpfValidatorsNumber(cpf: string): number[] {
  const cpfArray: number[] = [];
  cpfArray.push(Number(cpf[cpf.length - 2]));
  cpfArray.push(Number(cpf[cpf.length - 1]));
  return cpfArray;
}
function returnVefiryerNumber(
  cpfArray: number[],
  verifyerNumbers: number[]
): number {
  const firstNumberSum = cpfArray.reduce((acc, curr, currentIndex) => {
    return acc + curr * verifyerNumbers[currentIndex];
  }, 0);
  let numberVerifyer = (firstNumberSum * 10) % 11;
  if (numberVerifyer === 10 || numberVerifyer === 11) {
    numberVerifyer = 0;
  }

  return numberVerifyer;
}
export default function cpfIsValid(cpf: string): boolean {
  const cpfNumbers = convertCpfToArray(cpf);

  const cpfValidatorNumbers = returnCpfValidatorsNumber(cpf);
  if (cpf.length !== 11 || typeof cpf !== "string") {
    return false;
  }
  let verifyerNumber = returnVefiryerNumber(
    cpfNumbers.slice(0, 9),
    [10, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  if (verifyerNumber !== cpfValidatorNumbers[0]) {
    return false;
  }

  verifyerNumber = returnVefiryerNumber(
    cpfNumbers.slice(0, 10),
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  if (verifyerNumber !== cpfValidatorNumbers[1]) {
    return false;
  }
  return true;
}
