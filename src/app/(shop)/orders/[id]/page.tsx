"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Package, Check } from "lucide-react";
import { getOrderById, type Order } from "@/lib/apiClients";

const ORDER_STEPS = [
  { key: "PENDING", label: "Order Placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function OrderProgressBar({ status }: { status: string }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status);
  const isCancelled = status === "CANCELLED";

  return (
    <div className="w-full py-4">
      {isCancelled ? (
        <div className="text-center py-4">
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Order Cancelled
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {index > 0 && (
                  <div
                    className={`absolute left-0 right-1/2 top-4 h-1 -translate-y-1/2 ${
                      index <= currentIndex ? "bg-green-500" : "bg-muted"
                    }`}
                    style={{ left: "-50%" }}
                  />
                )}
                {index < ORDER_STEPS.length - 1 && (
                  <div
                    className={`absolute left-1/2 right-0 top-4 h-1 -translate-y-1/2 ${
                      index < currentIndex ? "bg-green-500" : "bg-muted"
                    }`}
                    style={{ right: "-50%" }}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const result = await getOrderById(orderId);
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        setError(result.message || "Order not found");
      }
      setLoading(false);
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-red-500 mb-4">{error || "Order not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Order #{order.orderNumber?.slice(-8) || order.id.slice(-8)}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{Number(order.total).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{order.paymentMethod || "COD"}</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderProgressBar status={order.status} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.title || `Product ${item.productId.slice(-6)}`}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
