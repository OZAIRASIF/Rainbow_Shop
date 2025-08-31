import { NextResponse } from "next/server";
// import { carts_collection, orders_collection } from "@/src/lib/db";
import { getCollections } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { cartsCollection } = await getCollections();
    const { ordersCollection } = await getCollections();
    const currentUser = await getCurrentUser(req);
    const data = await req.json();

    const cart = await cartsCollection.findOne({ username: currentUser });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = {
      username: currentUser,
      items: cart.items,
      billing_info: data.billing_info,
      status: "Placed",
    };

    await ordersCollection.insertOne(order);

    // clear cart
    await cartsCollection.updateOne(
      { username: currentUser },
      { $set: { items: [] } }
    );

    return NextResponse.json({ msg: "Order placed successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
