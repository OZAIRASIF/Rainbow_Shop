import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { cartsCollection } = await getCollections();
    const currentUser = await getCurrentUser(req);
    const item = await req.json();

    const result = await cartsCollection.updateOne(
      { username: currentUser },
      { $pull: { items: { product_id: item.product_id } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Item removed from cart" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
