const body = {
  error: "La autenticacion local ya no esta disponible en esta aplicacion.",
};

function createGoneResponse() {
  return Response.json(body, { status: 410 });
}

export const GET = createGoneResponse;
export const POST = createGoneResponse;
export const PUT = createGoneResponse;
export const PATCH = createGoneResponse;
export const DELETE = createGoneResponse;
