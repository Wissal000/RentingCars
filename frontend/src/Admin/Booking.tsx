"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CarIcon,
  Edit,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  city: string;
  rentalStartDate: string;
  rentalEndDate: string;
  notes: string;
  carId: {
    name: string;
    brand: string;
    pricePerDay: string;
    fuelType: string;
    transmission: string;
    image?: string;
  };
  status?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalAmount?: number;
  createdAt?: string;
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    fetchBookings(); // now it works
  }, []);

  // ✅ Move fetchBookings outside
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/booking");
      const bookingsData = response.data.map((booking: any) => ({
        ...booking,
        status: booking.status || "pending",
        totalAmount: booking.totalAmount || calculateTotalAmount(booking),
        createdAt: booking.createdAt || booking.rentalStartDate,
      }));

      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await axios.delete(`http://localhost:8080/booking/${bookingId}`);
      toast.success("Booking deleted successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete booking");
    }
  };
  // Add helper function to calculate total amount if not provided by API
  const calculateTotalAmount = (booking: any) => {
    const days = calculateDays(booking.rentalStartDate, booking.rentalEndDate);
    const pricePerDay =
      Number.parseInt(booking.carId.pricePerDay.replace(/[^0-9]/g, "")) || 0;
    return days * pricePerDay;
  };

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          `${booking.firstName} ${booking.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.carId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.carId.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    active: bookings.filter((b) => b.status === "active").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    revenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  const BookingSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-8 mb-2" />
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage and track all car rental bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                  <p className="text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CarIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.revenue} dh
                  </p>
                  <p className="text-gray-600">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={(value) =>
                    setViewMode(value as "cards" | "table")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="cards">Cards</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Display */}
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking._id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.firstName} {booking.lastName}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`${getStatusColor(
                              booking.status
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status || "pending"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          dh {booking.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {calculateDays(
                            booking.rentalStartDate,
                            booking.rentalEndDate
                          )}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {booking.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {booking.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.city}
                      </div>
                    </div>

                    {/* Rental Period */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Rental Period
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.rentalStartDate).toLocaleDateString()}{" "}
                        → {new Date(booking.rentalEndDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Car Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.carId.brand} {booking.carId.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.carId.pricePerDay}/day
                          </p>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {booking.carId.fuelType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {booking.carId.transmission}
                            </Badge>
                          </div>
                        </div>
                        <img
                          src={
                            booking.carId.image ||
                            "/placeholder.svg?height=60&width=80"
                          }
                          alt={`${booking.carId.brand} ${booking.carId.name}`}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild></DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Complete information for booking #{booking._id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Customer Information
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Name:</strong> {booking.firstName}{" "}
                                  {booking.lastName}
                                </p>
                                <p>
                                  <strong>Email:</strong> {booking.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {booking.phone}
                                </p>
                                <p>
                                  <strong>License:</strong>{" "}
                                  {booking.licenseNumber}
                                </p>
                                <p>
                                  <strong>Address:</strong> {booking.address},{" "}
                                  {booking.city}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Rental Information
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Car:</strong> {booking.carId.brand}{" "}
                                  {booking.carId.name}
                                </p>
                                <p>
                                  <strong>Start Date:</strong>{" "}
                                  {new Date(
                                    booking.rentalStartDate
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>End Date:</strong>{" "}
                                  {new Date(
                                    booking.rentalEndDate
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>Duration:</strong>{" "}
                                  {calculateDays(
                                    booking.rentalStartDate,
                                    booking.rentalEndDate
                                  )}{" "}
                                  days
                                </p>
                                <p>
                                  <strong>Total Amount:</strong> dh
                                  {booking.totalAmount}
                                </p>
                                {booking.notes && (
                                  <p>
                                    <strong>Notes:</strong> {booking.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            aria-label="Delete booking"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="max-w-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
                              This will permanently delete the booking.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-row gap-2 items-center">
                            <AlertDialogCancel className="...">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(booking._id)}
                              className="flex items-center gap-2 ..." // make button a flex container, center items, add gap between icon & text
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Rental Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {booking.carId.brand} {booking.carId.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.carId.pricePerDay}/day
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(
                              booking.rentalStartDate
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            to{" "}
                            {new Date(
                              booking.rentalEndDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            booking.status
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        dh {booking.totalAmount}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                aria-label="Delete booking"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="max-w-sm">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-semibold">
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
                                  This will permanently delete the booking.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex flex-row gap-2 items-center">
                                <AlertDialogCancel className="...">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(booking._id)}
                                  className="flex items-center gap-2 ..." // make button a flex container, center items, add gap between icon & text
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredBookings.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
