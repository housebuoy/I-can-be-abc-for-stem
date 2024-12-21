"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Button Component
import { Input } from "@/components/ui/input"; // Input Component
import { Label } from "@/components/ui/label"; // Label Component
import { auth } from "../../../../../firebase";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LuChevronDown } from "react-icons/lu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function TransactionDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // New fields
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [officerInCharge, setOfficerInCharge] = useState("");
  const [officerInChargeContact, setOfficerInChargeContact] = useState("");
  const [status, setStatus] = useState("");

  // Extract `transactionId` from params
  const { transactionId } = useParams();
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const waitForUser = new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe(); // Clean up the listener
            resolve(user);
          }, reject);
        });
        const user = await waitForUser;

        if (!transactionId) {
          setError("Invalid transaction ID");
          return;
        }

        setLoading(true);
        setError(null);

        if (!user) {
          alert("You must be logged in to access this resource.");
          return;
        }

        // Retrieve the token from Firebase
        const token = await user.getIdToken();

        const response = await fetch(`/api/orders/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }

        const data = await response.json();
        setOrder(data);
        setDeliveryCompany(data.deliveryCompany || "");
        setOfficerInCharge(data.officerInCharge || "");
        setOfficerInChargeContact(data.officerInChargeContact || "");
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        setError("Unable to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [transactionId]);

  const handleSaveChanges = async () => {
    try {
      if (!deliveryCompany || !officerInCharge || !officerInChargeContact || !status) {
        alert("Please fill in all required fields.");
        return;
      }
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/orders/transactions-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryCompany,
          officerInCharge,
          officerInChargeContact,
          status,
          transactionId: order.transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setIsEditing(false);
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update the order. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!order) {
    return <p>No order details available.</p>;
  }

  return (
    <SidebarProvider className="pt-24 w-full bg-gray-100">
      <AdminSidebar />
      <main>
        <SidebarTrigger className="z-50 fixed hover:text-indigo-600" />
      </main>
      <div className="pt-2 px-10 w-full  min-h-screen">
        <Breadcrumb className="fixed top-20 pt-6 bg-gray-100 w-full">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  Orders Management
                  <LuChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/admin/dashboard">Users Managenent</BreadcrumbLink>
                  </DropdownMenuItem>                  
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/admin/dashboard">Reports and Analytics</BreadcrumbLink>
                  </DropdownMenuItem>                  
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{order.transactionId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold mb-4 pt-14 text-indigo-600">Order Details</h1>
        {/* <p>
          <strong>Transaction ID:</strong> {order.transactionId}
        </p> */}
        <div className="">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Primary Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Transaction ID</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.transactionId}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">User ID</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.userId}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Order Date</Label>
                    <Input
                      id="deliveryCompany"
                      value={new Date(order.createdAt).toLocaleDateString()}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="delivery">Status</Label>
                    <Input
                      id="deliveryStatus"
                      value={order.status}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      className={`${
                        order.status?.toLowerCase() === "delivered"
                          ? "bg-green-500"
                          : order.status?.toLowerCase() === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      } text-white`}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Customer Name</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.shippingDetails?.fullName}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                      
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="customerPhone">Customer Phone</Label>
                    <Input
                      id="customerPhone"
                      value={order.shippingDetails?.phone}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Address</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.shippingDetails?.address}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">City</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.shippingDetails?.city}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Landmark</Label>
                    <Input
                      id="deliveryCompany"
                      value={order.shippingDetails?.landmark}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={order.shippingDetails?.postalCode}
                      // onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={true}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Cart Details</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-6">
                {order.cartItems?.map((item, index) => (
                    <Accordion type="single" collapsible={true} key={index}>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>{`${index+1}. ${item.title}`}</AccordionTrigger>
                        <AccordionContent>
                          <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                            <div className="mt-4">
                              <Label htmlFor="cartItemTitle">Product Title</Label>
                              <Input
                                id="cartItemTitle"
                                value={item.title}
                                disabled={true}
                              />
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="cartItemCode">Product Code</Label>
                              <Input
                                id="cartItemCode"
                                value={item.code}
                                disabled={true}
                              />
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="cartItemDescription">Product Description</Label>
                              <Input
                                id="cartItemDescription"
                                value={item.description}
                                disabled={true}
                              />
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="cartItemCategory">Product Category</Label>
                              <Input
                                id="cartItemCategory"
                                value={item.category.title}
                                disabled={true}
                              />
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="cartItemPrice">Product Price</Label>
                              <Input
                                id="cartItemPrice"
                                value={`GH¢ ${item.price}`}
                                disabled={true}
                              />
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="cartItemQuantity">Quantity Ordered</Label>
                              <Input
                                id="cartItemQuantity"
                                value={item.quantity}
                                disabled={true}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>))}
                  </ol>
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Payment Details</AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <div className="mt-4">
                <Label htmlFor="couponCode">Coupon Code</Label>
                <Input
                  id="couponCode"
                  value={order.couponCode || "Null"}
                  // onChange={(e) => setDeliveryCompany(e.target.value)}
                  disabled={true}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="discountedAmount">Discounted Amount</Label>
                <Input
                  id="discountedAmount"
                  value={order.discountedAmount || "Null"}
                  // onChange={(e) => setDeliveryCompany(e.target.value)}
                  disabled={true}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="total">Total Amount</Label>
                <Input
                  id="total"
                  value={order.total}
                  // onChange={(e) => setDeliveryCompany(e.target.value)}
                  disabled={true}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="paymentReference">Payment Reference</Label>
                <Input
                  id="paymentReference"
                  value={order.paymentReference}
                  // onChange={(e) => setDeliveryCompany(e.target.value)}
                  disabled={true}
                />
              </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Manage Delivery Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  {/* Editable Fields */}
                  <div className="mt-4">
                    <Label htmlFor="deliveryCompany">Delivery Company</Label>
                    <Input
                      id="deliveryCompany"
                      value={deliveryCompany}
                      onChange={(e) => setDeliveryCompany(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="officerInCharge">Officer in Charge</Label>
                    <Input
                      id="officerInCharge"
                      value={officerInCharge}
                      onChange={(e) => setOfficerInCharge(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="officerInChargeContact">Contact</Label>
                    <Input
                      id="officerInChargeContact"
                      value={officerInChargeContact}
                      onChange={(e) => setOfficerInChargeContact(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="orderStatus">Order Status</Label>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => setStatus(value)} 
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="orderStatus" className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="mt-4 bg-indigo-600 text-white"
                    onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save Changes" : "Edit"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="mt-4 ml-2"
                    onClick={() => router.back()}
                  >
                    Back to Orders
                  </Button>
                  </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </SidebarProvider>
  );
}
