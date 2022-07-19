interface IErrorResponse {
  isNull: boolean;
  nullProperties?: string[];
}
export default function hasNullProperty(data: object) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const nullKeys = [];
  let invalidVerifier: IErrorResponse;

  values.forEach((Element, index) => {
    if (!Element) {
      nullKeys.push(keys[index]);
    }
  });

  if (nullKeys.length !== 0) {
    invalidVerifier = {
      isNull: true,
      nullProperties: nullKeys,
    };
  } else {
    invalidVerifier = {
      isNull: false,
    };
  }

  return invalidVerifier;
}
