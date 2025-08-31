import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET cart
export async function GET(req) {
  try {
    const { cartsCollection } = await getCollections();
    const { productsCollection } = await getCollections();
    const currentUser = await getCurrentUser(req);
    const cart = await cartsCollection.findOne({ username: currentUser });

    if (!cart) return NextResponse.json({ items: [] });

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productsCollection.findOne({ _id: new ObjectId(item.product_id) });
        return product
          ? { ...item, name: product.name, price: product.price }
          : item;
      })
    );

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
