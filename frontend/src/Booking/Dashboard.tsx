"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  CarIcon,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  rentalStartDate: string;
  rentalEndDate: string;
}

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
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
        toast.error("Failed to load cars. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);


  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === "all" || car.brand === selectedBrand;

      const matchesFuelType =
        selectedFuelType === "all" || car.fuelType === selectedFuelType;

      const price = Number.parseInt(car.pricePerDay.replace(/[^\d]/g, ""));
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && price < 200) ||
        (priceRange === "medium" && price >= 200 && price < 500) ||
        (priceRange === "high" && price >= 500);

      return matchesSearch && matchesBrand && matchesFuelType && matchesPrice;
    });
  }, [cars, searchTerm, selectedBrand, selectedFuelType, priceRange]);


  const calculateRentalDays = () => {
    if (!bookingForm.rentalStartDate || !bookingForm.rentalEndDate) return 0;
    const start = new Date(bookingForm.rentalStartDate);
    const end = new Date(bookingForm.rentalEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!selectedCar) return 0;
    const days = calculateRentalDays();
    const pricePerDay = Number.parseInt(
      selectedCar.pricePerDay.replace(/[^\d]/g, "")
    );
    return days * pricePerDay;
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    // Validate dates
    const startDate = new Date(bookingForm.rentalStartDate);
    const endDate = new Date(bookingForm.rentalEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      await axios.post("http://localhost:8080/booking", {
        ...bookingForm,
        carId: selectedCar._id,
      });
      toast.success("🎉 Booking confirmed successfully!");
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("all");
    setSelectedFuelType("all");
    setPriceRange("all");
  };

  const CarSkeleton = () => (
    <div className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <Skeleton className="h-64 w-full" />
      <div className="p-6 relative z-10">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={4000} theme="light" />

      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-10 text-center">
          <CarIcon className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-4xl font-bold mt-4">Drive Your Dreams</h1>
          <p className="text-lg mt-2">
            Discover premium vehicles that match your style and adventure needs
          </p>
        </div>
      </header>

      {/* Search & Filters Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Input
              placeholder="Search by car name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-12 border-gray-300 rounded-md"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 rounded-md"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
             

              {/* Fuel Type Filter */}
              <Select
                value={selectedFuelType}
                onValueChange={setSelectedFuelType}
              >
                <SelectTrigger className="h-12 border-gray-300 rounded-md">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="essence">Essence</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybride">Hybrid</SelectItem>
                  <SelectItem value="électrique">Electric</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12 border-gray-300 rounded-md">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under 200 DH/day</SelectItem>
                  <SelectItem value="medium">200–500 DH/day</SelectItem>
                  <SelectItem value="high">500+ DH/day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </section>

      {/* Cars Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CarSkeleton key={i} />)
          ) : filteredCars.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-xl mb-4">
                No cars found. Try adjusting your search criteria.
              </p>
              <Button onClick={clearFilters} className="px-6 py-3">
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => handleBooking(car)}
              >
                <img
                  src={car.image || "/placeholder.svg?height=256&width=400"}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">
                  {car.brand} {car.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {car.fuelType || "N/A"} · {car.transmission || "N/A"}
                </p>
                  <p className="text-sm text-gray-600">
                  {car.color || "N/A"} 
                </p>
                <p className="text-blue-600 font-bold mt-2">
                  {car.pricePerDay} DH / day
                </p>
                <Button className="mt-4 w-full">Book Now</Button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border rounded-xl shadow-lg p-6">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold">
              Complete Your Booking
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {selectedCar &&
                `${selectedCar.brand} ${selectedCar.name} - ${selectedCar.pricePerDay} DH/day`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Rental Period */}
            <section>
              <h3 className="font-semibold mb-3">Rental Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="rentalStartDate"
                    className="block mb-1 text-sm font-medium"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="rentalStartDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingForm.rentalStartDate}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        rentalStartDate: e.target.value,
                      }))
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="rentalEndDate"
                    className="block mb-1 text-sm font-medium"
                  >
                    End Date
                  </Label>
                  <Input
                    id="rentalEndDate"
                    type="date"
                    min={
                      bookingForm.rentalStartDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    value={bookingForm.rentalEndDate}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        rentalEndDate: e.target.value,
                      }))
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              </div>

              {calculateRentalDays() > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md flex justify-between font-semibold">
                  <span>
                    {calculateRentalDays()} day
                    {calculateRentalDays() > 1 ? "s" : ""}
                    {" × "} {selectedCar?.pricePerDay} DH
                  </span>
                  <span>{calculateTotalPrice()} DH</span>
                </div>
              )}
            </section>

            {/* Personal Information */}
            <section>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="block mb-1 text-sm font-medium"
                  >
                    First Name
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="block mb-1 text-sm font-medium"
                  >
                    Last Name
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium"
                  >
                    Email Address
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium"
                  >
                    Phone Number
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Driver & Location Information */}
            <section>
              <h3 className="font-semibold mb-3">Driver & Location Details</h3>
              <div>
                <Label
                  htmlFor="licenseNumber"
                  className="block mb-1 text-sm font-medium"
                >
                  Driver's License Number
                </Label>
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
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label
                    htmlFor="address"
                    className="block mb-1 text-sm font-medium"
                  >
                    Address
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="city"
                    className="block mb-1 text-sm font-medium"
                  >
                    City
                  </Label>
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
                    className="border rounded-md p-2 w-full"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedCar(null)}
                className="px-6 py-3 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={calculateRentalDays() === 0}
                className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
