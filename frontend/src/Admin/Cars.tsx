import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Trash2, Edit, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Car {
  _id: string;
  name: string;
  brand: string;
  pricePerDay: string;
  description?: string;
  year?: number;
  color?: string;
  fuelType?: string;
  transmission?: string;
  image?: string;
  available: boolean;
  seats?: number;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
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
      alert("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const res = await fetch(`http://localhost:8080/cars/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCars(cars.filter((car) => car._id !== id));
        toast.success("Car deleted successfully!");
      } else {
        toast.error("Failed to delete car");
      }
    } catch (err) {
      toast.error("Error deleting car");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cars List</h1>
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
                  <Plus className="w-6 h-6 text-green-600" />
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
                  <Plus className="w-6 h-6 text-orange-600" />
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
                <Button
                  onClick={() => navigate("/admin/cars/add")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
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
                              src={car.image || "/placeholder.svg"}
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
      </div>
    </div>
  );
};

export default Cars;
