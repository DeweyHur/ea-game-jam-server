export function resOK(res, code, body) {
  console.log(`${code} OK - ${JSON.stringify(body)}`);    
  return res.send(body).status(code);
}

export function resError(res, code, ...errors) {
  console.error(`${code} ERROR - `, ...errors);
  return res.status(code).send(errors);
}