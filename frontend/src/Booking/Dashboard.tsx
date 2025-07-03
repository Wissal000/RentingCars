"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { CarIcon, Gauge, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface Car {
  _id: string;
  name: string;
  brand: string;
  pricePerDay: string;
  year?: number;
  color: string;
  fuelType?: "essence" | "diesel" | "hybride" | "électrique";
  transmission?: "manuelle" | "automatique";
  image?: string;
  available?: boolean;
}

interface BookingDetailsForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  city: string;
  rentalStartDate: string; // string because from input type=date
  rentalEndDate: string;
}

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingDetailsForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    city: "",
    rentalStartDate: "",
    rentalEndDate: "",
  });

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await axios.get<Car[]>("http://localhost:8080/cars");
        const availableCars = response.data.filter((car) => car.available);
        setCars(availableCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const getFuelIcon = (fuelType?: string) => {
    switch (fuelType) {
      case "électrique":
        return "⚡";
      case "hybride":
        return "🔋";
      case "diesel":
        return "⛽";
      default:
        return "⛽";
    }
  };

  const getFuelColor = (fuelType?: string) => {
    switch (fuelType) {
      case "électrique":
        return "bg-green-100 text-green-800";
      case "hybride":
        return "bg-blue-100 text-blue-800";
      case "diesel":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBooking = (car: Car) => {
    setSelectedCar(car);
    setBookingForm({
      rentalStartDate: "",
      rentalEndDate: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      address: "",
      city: "",
    });
  };

  // Update your booking submit to send this full form + carId:
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    try {
      await axios.post("http://localhost:8080/booking", {
        ...bookingForm,
        carId: selectedCar._id,
      });
      toast.success("Booking confirmed!");
      setSelectedCar(null);
      setBookingForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        address: "",
        city: "",
        rentalStartDate: "",
        rentalEndDate: "",
      });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book. Please try again.");
    }
  };

  const CarSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Car Rental
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our fleet of premium vehicles for your next adventure
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">
                {cars.length}
              </div>
              <p className="text-gray-600">Available Cars</p>
            </CardContent>
          </Card>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CarSkeleton key={index} />
              ))
            : cars.map((car) => (
                <Card
                  key={car._id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={car.image || "/placeholder.svg?height=200&width=300"}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                      Available
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {car.brand} {car.name}
                        </h3>
                        <p className="text-gray-600">{car.year || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {car.pricePerDay}
                        </div>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className={getFuelColor(car.fuelType)}
                      >
                        {getFuelIcon(car.fuelType)} {car.fuelType || "N/A"}
                      </Badge>
                      <Badge variant="outline">
                        <Gauge className="h-3 w-3 mr-1" />
                        {car.transmission || "N/A"}
                      </Badge>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2`}
                          style={{ backgroundColor: car.color.toLowerCase() }}
                        />
                        {car.color}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking(car)}
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>

        {/* Booking Modal */}
        <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book Your Car</DialogTitle>
              <DialogDescription>
                {selectedCar &&
                  `${selectedCar.brand} ${selectedCar.name} - ${selectedCar.pricePerDay}/day`}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={bookingForm.firstName}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={bookingForm.lastName}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  value={bookingForm.licenseNumber}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      licenseNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={bookingForm.address}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={bookingForm.city}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentalStartDate">Rental Start Date</Label>
                  <Input
                    id="rentalStartDate"
                    type="date"
                    value={bookingForm.rentalStartDate}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        rentalStartDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rentalEndDate">Rental End Date</Label>
                  <Input
                    id="rentalEndDate"
                    type="date"
                    value={bookingForm.rentalEndDate}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        rentalEndDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedCar(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Confirm Booking
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
