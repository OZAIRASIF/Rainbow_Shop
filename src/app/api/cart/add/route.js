import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { cartsCollection } = await getCollections();
    const currentUser = await getCurrentUser(req);
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const item = await req.json(); // { product_id, quantity }
    console.log("Adding to cart:", currentUser, item);

    const cart = await cartsCollection.findOne({ username: currentUser });

    if (!cart) {
      await cartsCollection.insertOne({ username: currentUser, items: [item] });
    } else {
      await cartsCollection.updateOne(
        { username: currentUser },
        { $push: { items: item } }
      );
    }

    return NextResponse.json({ msg: "Item added to cart" });
  } catch (err) {
    console.error("Cart add error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
