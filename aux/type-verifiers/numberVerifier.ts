interface IErrorResponse {
  isNumberInvalid: boolean;
  invalidNumber?: string[];
}
export default function hasInvalidNumber(data: object) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const invalidKeys: string[] = [];
  let invalidVerifier: IErrorResponse;

  values.forEach((Element: number, index) => {
    if (typeof Element !== "number") {
      invalidKeys.push(keys[index]);
    }
  });

  if (invalidKeys.length !== 0) {
    invalidVerifier = {
      isNumberInvalid: true,
      invalidNumber: invalidKeys,
    };
  } else {
    invalidVerifier = {
      isNumberInvalid: false,
    };
  }
  return invalidVerifier;
}
