interface IErrorResponse {
  isStringInvalid: boolean;
  invalidString?: string[];
}
export default function hasInvalidString(data: object) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  let invalidKeys: string[];
  let invalidVerifier: IErrorResponse;

  values.forEach((Element: string, index) => {
    if (typeof Element !== "string") {
      invalidKeys.push(keys[index]);
    }
  });

  if (invalidKeys.length !== 0) {
    invalidVerifier = {
      isStringInvalid: true,
      invalidString: invalidKeys,
    };
  } else {
    invalidVerifier = {
      isStringInvalid: false,
    };
  }
  return invalidVerifier;
}
