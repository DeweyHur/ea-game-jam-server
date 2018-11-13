export function resError(res, code, ...errors) {
  console.error(...errors);
  return res.status(code).send(errors);
}