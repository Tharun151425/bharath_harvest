import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Farmer } from "../../../firebaseFunctions/cropFarmer";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faLocationDot, faWeightScale, faDollarSign } from "@fortawesome/free-solid-svg-icons";

const PublicFarmerProfile = () => {
  const { farmerID } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const fetchedFarmer = await Farmer.getFarmer(farmerID);
        setFarmer(fetchedFarmer);

        const fetchedCrops = await fetchedFarmer.getCrops();
        setCrops(fetchedCrops);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [farmerID]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-[#FEFAE0]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <FontAwesomeIcon 
            icon={faLeaf} 
            className="text-5xl text-[#606C38]" 
          />
        </motion.div>
      </motion.div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0]/30">
        <p className="text-lg text-[#283618] bg-white p-6 rounded-lg shadow">Farmer not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#FEFAE0]/30 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Farmer Info Header */}
        <motion.div 
          className="bg-[#283618] rounded-t-xl p-8 text-center shadow-lg"
          variants={itemVariants}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h1 className="text-3xl font-bold text-[#FEFAE0] mb-2">
              {farmer.name}
            </h1>
            <motion.div 
              className="h-1 w-24 bg-[#DDA15E] mx-auto rounded-full mb-4"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <a
              href={"mailto:" + farmer.emailID}
              className="text-[#DDA15E] hover:text-[#BC6C25] transition-colors inline-flex items-center gap-2"
            >
              <span>{farmer.emailID}</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Crop Info */}
        <motion.div 
          className="bg-white rounded-b-xl shadow-lg p-8"
          variants={itemVariants}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#283618] flex items-center">
              <FontAwesomeIcon icon={faLeaf} className="text-[#606C38] mr-3" />
              Available Crops
            </h2>
          </div>

          {crops.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[#DDA15E]/20">
              <table className="w-full bg-white text-left border-collapse">
                <thead className="bg-[#FEFAE0]">
                  <tr>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">
                      Crop Name
                    </th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">
                      Variety
                    </th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">
                      Price/kg
                    </th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDA15E]/20">
                  {crops.map((crop) => (
                    <motion.tr
                      key={crop.cropID}
                      className="hover:bg-[#FEFAE0]/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      whileHover={{ backgroundColor: "rgba(254, 250, 224, 0.3)" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faLeaf} className="text-[#606C38] mr-2" />
                          <span className="font-medium text-[#283618]">{crop.cropName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#283618]">{crop.cropVariety}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faDollarSign} className="text-[#BC6C25] mr-2" />
                          <span className="font-medium text-[#BC6C25]">₹{crop.cropPrice}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faWeightScale} className="text-[#606C38] mr-2" />
                          <span className="text-[#283618]">{crop.cropWeight} kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faLocationDot} className="text-[#DDA15E] mr-2" />
                          <span className="text-[#283618]">{crop.cropLocation}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-[#FEFAE0]/30 rounded-lg"
              variants={itemVariants}
            >
              <FontAwesomeIcon icon={faLeaf} className="text-5xl text-[#606C38]/30 mb-4" />
              <p className="text-lg text-[#606C38]">No crops available at this time.</p>
            </motion.div>
          )}
          
          <motion.div 
            className="mt-8 pt-5 border-t border-[#DDA15E]/20 text-center"
            variants={itemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#283618" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-[#606C38] text-[#FEFAE0] rounded-lg shadow-md font-medium"
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PublicFarmerProfile;
