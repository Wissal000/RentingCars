"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CarIcon,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  Users,
  Hash,
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

import { Skeleton } from "@/components/ui/skeleton";

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
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount?: number;
  createdAt?: string;
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await axios.post(`http://localhost:8080/booking/${bookingId}`, {
        status: newStatus,
      });
      toast.success("Status updated & email sent successfully ✅");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status and sending email:", error);
      toast.error("Failed to update status or send email ❌");
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = (booking: any) => {
    const days = calculateDays(booking.rentalStartDate, booking.rentalEndDate);
    const pricePerDay =
      Number.parseInt(booking.carId.pricePerDay.replace(/[^0-9]/g, "")) || 0;
    return days * pricePerDay;
  };

  useEffect(() => {
    let filtered = bookings;
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          `${booking.firstName} ${booking.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.carId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.carId.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const stats = {
    total: bookings.length,
    revenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage and track all car rental bookings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-gray-600 text-sm">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{stats.revenue} dh</p>
                <p className="text-gray-600 text-sm">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-3xl">
           <div className="flex items-center w-full bg-white border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition">
  <div className="pl-4 pr-2 text-gray-400">
    <Search className="h-5 w-5" />
  </div>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search bookings..."
    className="w-full py-2 pr-4 text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400"
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.firstName} {booking.lastName}
                    </CardTitle>
                    <div className="mt-1">
                      <Select
                        defaultValue={booking.status}
                        onValueChange={(value) =>
                          handleStatusChange(booking._id, value)
                        }
                      >
                        <SelectTrigger
                          className={`text-xs py-1 px-2 ${getStatusColor(
                            booking.status
                          )} rounded-full border-none`}
                        >
                          <SelectValue
                            placeholder="pending"
                            className="capitalize"
                          />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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

              <CardContent className="space-y-3 text-sm text-gray-600">
                <div>
                  <p>
                    <Mail className="inline w-4 h-4 mr-1" />
                    {booking.email}
                  </p>
                  <p>
                    <Phone className="inline w-4 h-4 mr-1" />
                    {booking.phone}
                  </p>
                  <p>
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {booking.city}
                  </p>
                  <p>
                    <Hash className="inline w-4 h-4 mr-1" />
                    {booking.licenseNumber}
                  </p>
                </div>

                <div className="bg-gray-100 p-2 rounded">
                  <p className="font-medium mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Rental Period
                  </p>
                  <p>
                    {new Date(booking.rentalStartDate).toLocaleDateString()} →{" "}
                    {new Date(booking.rentalEndDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-semibold">
                    {booking.carId.brand} {booking.carId.name}
                  </p>
                  <p className="text-sm">{booking.carId.pricePerDay} / day</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {booking.carId.fuelType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {booking.carId.transmission}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the booking.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(booking._id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && !loading && (
          <Card className="text-center py-12 mt-10">
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
