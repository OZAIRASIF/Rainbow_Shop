import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { productsCollection } = await getCollections();
    const products = await productsCollection
      .find({}, { projection: { name: 1, price: 1, description: 1, images: 1, product_url: 1, category: 1 } })
      .toArray();

    const formatted = products.map(p => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({ products: formatted });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
