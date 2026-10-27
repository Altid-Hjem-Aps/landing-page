export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      applinks: {
        details: [
          {
            appIDs: ["4W5RBP3T94.dk.altidhjem.app"],
            components: [{ "/": "/inviter" }, { "/": "/invitation" }],
          },
        ],
      },
      webcredentials: {
        apps: ["4W5RBP3T94.dk.altidhjem.app"],
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
