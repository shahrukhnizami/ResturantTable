import Camera from "../models/camera.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { User } from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeCameras = await Camera.countDocuments({ status: "active" });
    const restaurantAdmins = await User.countDocuments({
      role: "restaurant-admin" || "admin",
    });


    if (totalRestaurants === 0) {
      return res.json({
        error: true,
        message: "No restaurants found",
        stats: [
          {
            title: "Total Restaurants",
            value: 0,
          },
          {
            title: "Total Cameras",
            value: activeCameras,
          },
          {
            title: "Restaurant Admins",
            value: restaurantAdmins,
          },
          {
            title: "Total Users",
            value: totalUsers,
          },
        ],
      });
    }
    
    if (totalUsers === 0) {
      return res.json({
        error: true,
        message: "No users found",
        stats: [
          {
            title: "Total Restaurants",
            value: totalRestaurants,
          },
          {
            title: "Total Cameras",
            value: activeCameras,
          },
          {
            title: "Restaurant Admins",
            value: restaurantAdmins,
          },
          {
            title: "Total Users",
            value: 0,
          },
        ],
      });
    }
   if (activeCameras === 0) {
      return res.json({
        error: true,
        message: "No Cameras found",
        stats: [
          {
            title: "Total Restaurants",
            value: totalRestaurants,
          },
          {
            title: "Total Cameras",
            value: 0,
          },
          {
            title: "Restaurant Admins",
            value: restaurantAdmins,
          },
          {
            title: "Total Users",
            value: totalUsers,
          },
        ],
      });
    }
    
    if (restaurantAdmins === 0) {
      return res.json({
        error: true,
        message: "No Admins found",
        stats: [
          {
            title: "Total Restaurants",
            value: totalRestaurants,
          },
          {
            title: "Total Cameras",
            value: activeCameras,
          },
          {
            title: "Restaurant Admins",
            value: 0 ,
          },
          {
            title: "Total Users",
            value: totalUsers,
          },
        ],
      });
    }
    
    
    res.json({
        error : false,
        message: "Dashboard stats fetched successfully",
      stats: [
        {
          title: "Total Restaurants",
          value: totalRestaurants,
        },
        {
          title: "Total Cameras",
          value: activeCameras,
        },
        {
          title: "Restaurant Admins",
          value: restaurantAdmins,
        },
        {
          title: "Total Users",
          value: totalUsers,
        },
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: true,
        message: "Internal Server Error",
        errorDetail: error.message,
      });
  }
};


// export const getRestaurantAdminDashboardStats = async (req, res) => {
//   try {
//     const restaurantAdminId = req.user._id; 

//     console.log(restaurantAdminId , "====" );
    
    
//     const restaurantAdmin = await User.findById(restaurantAdminId);
//     if (!restaurantAdmin) {
//       return res.json({
//         error: true,
//         message: "Restaurant admin not found",
//         stats: [],
//       });
//     }

//     const restaurantId = restaurantAdmin.restaurant; // Assuming the restaurant ID is stored in the restaurantAdmin document

//     // Fetch the total branches under the restaurant
//     const totalBranches = await Branch.countDocuments({ restaurant: restaurantId });

//     // Fetch the total active cameras under the restaurant's branches
//     const activeCameras = await Camera.countDocuments({
//       branch: { $in: restaurantAdmin.branches }, // Assuming the restaurant admin has access to specific branches
//       status: "active",
//     });

//     // Fetch the total tables under the restaurant's branches
//     const totalTables = await Table.countDocuments({
//       branch: { $in: restaurantAdmin.branches }, // Assuming tables are associated with branches
//     });

//     // Fetch the total lower-level admins (e.g., branch admins) under the restaurant
//     const totalLowerAdmins = await User.countDocuments({
//       restaurant: restaurantId, // Lower admins are associated with the same restaurant
//       role: "branch-admin", // Assuming the role for lower admins is "branch-admin"
//     });

//     // Check if any of the stats are zero and return appropriate messages
//     if (totalBranches === 0) {
//       return res.json({
//         error: true,
//         message: "No branches found for this restaurant",
//         stats: [],
//       });
//     }

//     if (activeCameras === 0) {
//       return res.json({
//         error: true,
//         message: "No active cameras found for this restaurant",
//         stats: [],
//       });
//     }

//     if (totalTables === 0) {
//       return res.json({
//         error: true,
//         message: "No tables found for this restaurant",
//         stats: [],
//       });
//     }

//     if (totalLowerAdmins === 0) {
//       return res.json({
//         error: true,
//         message: "No lower admins found for this restaurant",
//         stats: [],
//       });
//     }

//     // Return the stats if everything is fine
//     res.json({
//       error: false,
//       message: "Restaurant admin dashboard stats fetched successfully",
//       stats: [
//         {
//           title: "Total Branches",
//           value: totalBranches,
//         },
//         {
//           title: "Total Active Cameras",
//           value: activeCameras,
//         },
//         {
//           title: "Total Tables",
//           value: totalTables,
//         },
//         {
//           title: "Total Lower Admins",
//           value: totalLowerAdmins,
//         },
//       ],
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: true,
//       message: "Internal Server Error",
//       errorDetail: error.message,
//     });
//   }
// };