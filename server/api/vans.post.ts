export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  // Basic validation could go here

  const van = await prisma.van.create({
    data: {
      name: body.name,
      plateNumber: body.plateNumber,
      price: body.price,
      features: body.features, // Assumed to be JSON compatible array/object
      images: body.images,
      status: body.status || "AVAILABLE",
      description: body.description,
      phone: body.phone || "",
    },
  });

  return van;
});
