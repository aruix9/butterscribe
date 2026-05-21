import { loadEnvConfig } from "@next/env";
import { cwd } from "process";
import { connectToDatabase } from "..";
import { data } from "../../../../data.ts";
import { Cart } from "@/models/cart";

loadEnvConfig(cwd());

const main = async () => {
  try {
    const { dummyCart } = data;
    await connectToDatabase(process.env.MONGODB_URI);
    await Cart.deleteMany();
    const createdCarts = await Cart.insertMany(dummyCart);

    console.log({ createdCarts, message: "Seeded database successfully" });
    process.exit(0);
  } catch (error) {
    console.error({ error });
    throw new Error("Failed to seed database");
  }
};

main();
