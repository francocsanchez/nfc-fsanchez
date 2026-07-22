export async function GET() {
  return Response.json(
    {
      ok: true,
      service: "nfc-fsanchez",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
