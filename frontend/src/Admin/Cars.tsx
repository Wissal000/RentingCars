"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface EditCarForm {
  name: string;
  brand: string;
  pricePerDay: string;
  year: number | "";
  color: string;
  fuelType: string;
  transmission: string;
  image: string;
  available: boolean;
}

export default function CarsAdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editForm, setEditForm] = useState<EditCarForm>({
    name: "",
    brand: "",
    pricePerDay: "",
    year: "",
    color: "",
    fuelType: "",
    transmission: "",
    image: "",
    available: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch("http://localhost:8080/cars");
      const data = await res.json();
      setCars(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/cars/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCars((prev) => prev.filter((car) => car._id !== id));
        toast({
          title: "Success",
          description: "Car deleted successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete car",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error deleting car",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setEditForm({
      name: car.name,
      brand: car.brand,
      pricePerDay: car.pricePerDay,
      year: car.year || "",
      color: car.color,
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      image: car.image || "",
      available: car.available ?? true,
    });
    setImageFile(null);
    setImagePreview(car.image || "");
  };

  const closeEditModal = () => {
    setEditingCar(null);
    setEditForm({
      name: "",
      brand: "",
      pricePerDay: "",
      year: "",
      color: "",
      fuelType: "",
      transmission: "",
      image: "",
      available: true,
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("brand", editForm.brand);
      formData.append("pricePerDay", editForm.pricePerDay);
      formData.append("year", editForm.year.toString());
      formData.append("color", editForm.color);
      formData.append("fuelType", editForm.fuelType);
      formData.append("transmission", editForm.transmission);
      formData.append("available", editForm.available.toString());

      // If a new image was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`http://localhost:8080/cars/${editingCar._id}`, {
        method: "PUT",
        body: formData, // 💡 Send FormData (do NOT set Content-Type manually)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update car");
      }

      const result = await res.json();

      // Update frontend state
      setCars((prev) =>
        prev.map((car) => (car._id === editingCar._id ? result.car : car))
      );

      toast({
        title: "Success",
        description: "Car updated successfully!",
      });

      closeEditModal();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update car.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshCarData = async (carId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/cars/${carId}`);
      if (res.ok) {
        const updatedCar = await res.json();
        setCars(cars.map((car) => (car._id === carId ? updatedCar : car)));
      }
    } catch (error) {
      console.error("Failed to refresh car data:", error);
    }
  };

  const handleInputChange = (
    field: keyof EditCarForm,
    value: string | number | boolean
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const TableSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-12 w-16" />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableSkeleton key={i} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cars Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your rental fleet</p>
          </div>
          <Button
            onClick={() => navigate("/admin/cars/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Car
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Cars
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {cars.filter((car) => car.available).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rented</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {cars.filter((car) => !car.available).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-900">
              All Cars ({cars.length})
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage your car rental fleet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {cars.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cars found
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first car to the system
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/admin/cars/add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Car
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">
                        Image
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Vehicle
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Price/Day
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Year
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Color
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Fuel Type
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow
                        key={car._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="py-4">
                          {car.image ? (
                            <img
                              src={
                                car.image ||
                                "/placeholder.svg?height=48&width=64"
                              }
                              alt={car.name}
                              className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                No image
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {car.name}
                            </p>
                            <p className="text-sm text-gray-600">{car.brand}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-semibold text-green-600">
                            {car.pricePerDay}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-gray-700">
                          {car.year || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 text-gray-700">
                          {car.color || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 text-gray-700 capitalize">
                          {car.fuelType || "N/A"}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={car.available ? "default" : "secondary"}
                            className={
                              car.available
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {car.available ? "Available" : "Rented"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(car)}
                              className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCar(car._id)}
                              className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Car Modal */}
        <Dialog open={!!editingCar} onOpenChange={closeEditModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Car</DialogTitle>
              <DialogDescription>
                Update the car information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Car Name *</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Model S"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={editForm.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="e.g., Tesla"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price Per Day *</Label>
                  <Input
                    id="pricePerDay"
                    value={editForm.pricePerDay}
                    onChange={(e) =>
                      handleInputChange("pricePerDay", e.target.value)
                    }
                    placeholder="e.g., $120"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={editForm.year}
                    onChange={(e) =>
                      handleInputChange(
                        "year",
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    placeholder="e.g., 2023"
                    min="1900"
                    max="2030"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={editForm.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="e.g., Pearl White"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={editForm.fuelType}
                    onValueChange={(value) =>
                      handleInputChange("fuelType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybride">Hybride</SelectItem>
                      <SelectItem value="électrique">Électrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={editForm.transmission}
                    onValueChange={(value) =>
                      handleInputChange("transmission", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuelle">Manuelle</SelectItem>
                      <SelectItem value="automatique">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available">Availability</Label>
                  <Select
                    value={editForm.available.toString()}
                    onValueChange={(value) =>
                      handleInputChange("available", value === "true")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Car Image</Label>
                <div className="space-y-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Car preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          handleInputChange("image", "");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    Upload a new image or keep the existing one. Supported
                    formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
